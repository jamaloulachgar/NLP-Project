from __future__ import annotations

import os
from typing import Any, Dict, List

import requests
import streamlit as st


def get_nlp_url() -> str:
    return (os.getenv("NLP_URL") or "http://127.0.0.1:8001").rstrip("/")


def call_chat(nlp_url: str, message: str, conversation_id: str, language: str) -> Dict[str, Any]:
    r = requests.post(
        f"{nlp_url}/api/chat",
        json={"message": message, "conversationId": conversation_id, "language": language},
        timeout=60,
    )
    r.raise_for_status()
    return r.json()


st.set_page_config(page_title="University Chatbot — Streamlit Demo", layout="wide")

st.title("University Chatbot — Streamlit Demo")
st.caption("This UI calls your FastAPI NLP service (`/api/chat`) and shows answer + sources + explain.")

with st.sidebar:
    st.subheader("Settings")
    nlp_url = st.text_input("NLP URL", value=get_nlp_url(), help="Example: http://127.0.0.1:8001")
    language = st.selectbox("Language", options=["en", "ar"], index=0)
    show_explain = st.checkbox("Show explain", value=True)
    show_sources = st.checkbox("Show sources", value=True)

    # Show live server config (helps avoid calling the wrong port/instance)
    try:
        health = requests.get(f"{nlp_url}/api/health", timeout=5).json()
        st.caption("NLP /api/health")
        st.json(health, expanded=False)
    except Exception as e:
        st.warning(f"Cannot reach {nlp_url}/api/health: {e}")

    if st.button("Reset conversation"):
        st.session_state.pop("messages", None)
        st.session_state["conversation_id"] = f"st_{os.urandom(4).hex()}"


if "conversation_id" not in st.session_state:
    st.session_state["conversation_id"] = f"st_{os.urandom(4).hex()}"
if "messages" not in st.session_state:
    st.session_state["messages"] = []


def render_message(role: str, content: str):
    with st.chat_message("user" if role == "user" else "assistant"):
        st.markdown(content)


for m in st.session_state["messages"]:
    render_message(m["role"], m["content"])
    if m["role"] == "assistant":
        if show_sources and m.get("sources"):
            with st.expander("Sources", expanded=False):
                for s in m["sources"]:
                    st.markdown(f"- **{s.get('title','Source')}** — `{s.get('url','')}` ({s.get('type','')})")
        if show_explain and m.get("explain"):
            with st.expander("Explain", expanded=False):
                st.json(m["explain"])


prompt = st.chat_input("Ask a question (calendar, admissions, events…)")  # type: ignore[arg-type]
if prompt:
    st.session_state["messages"].append({"role": "user", "content": prompt})
    render_message("user", prompt)

    with st.chat_message("assistant"):
        with st.spinner("Thinking…"):
            try:
                data = call_chat(
                    nlp_url=nlp_url,
                    message=prompt,
                    conversation_id=st.session_state["conversation_id"],
                    language=language,
                )
                answer = data.get("answer", "")
                st.markdown(answer)
                st.session_state["messages"].append(
                    {
                        "role": "assistant",
                        "content": answer,
                        "sources": data.get("sources", []),
                        "explain": data.get("explain", {}),
                    }
                )
                if show_sources and data.get("sources"):
                    with st.expander("Sources", expanded=False):
                        for s in data["sources"]:
                            st.markdown(
                                f"- **{s.get('title','Source')}** — `{s.get('url','')}` ({s.get('type','')})"
                            )
                if show_explain and data.get("explain"):
                    with st.expander("Explain", expanded=False):
                        st.json(data["explain"])
            except Exception as e:
                st.error(f"Error calling NLP: {e}")


