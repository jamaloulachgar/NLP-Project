import type { NewsItem, Event, Program, Lab, Service } from '@/types';

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: {
      fr: "La FSR remporte le Prix National de l'Innovation",
      ar: "كلية العلوم تفوز بالجائزة الوطنية للابتكار",
      en: "FSR Wins National Innovation Award"
    },
    excerpt: {
      fr: "Notre équipe de recherche en biotechnologie a été récompensée pour ses travaux sur les énergies renouvelables.",
      ar: "تم تكريم فريق البحث في التكنولوجيا الحيوية لأعماله في مجال الطاقات المتجددة.",
      en: "Our biotechnology research team was recognized for their work on renewable energy."
    },
    date: "2024-01-15",
    image: "/placeholder.svg",
    category: "achievement"
  },
  {
    id: '2',
    title: {
      fr: "Ouverture des inscriptions pour l'année 2024-2025",
      ar: "فتح باب التسجيل للسنة الجامعية 2024-2025",
      en: "Registration Open for 2024-2025 Academic Year"
    },
    excerpt: {
      fr: "Les inscriptions pour les nouveaux étudiants sont ouvertes. Découvrez les procédures et les documents requis.",
      ar: "التسجيلات للطلاب الجدد مفتوحة. اكتشف الإجراءات والوثائق المطلوبة.",
      en: "Registration for new students is open. Discover the procedures and required documents."
    },
    date: "2024-01-10",
    image: "/placeholder.svg",
    category: "announcement"
  },
  {
    id: '3',
    title: {
      fr: "Conférence internationale sur l'Intelligence Artificielle",
      ar: "مؤتمر دولي حول الذكاء الاصطناعي",
      en: "International Conference on Artificial Intelligence"
    },
    excerpt: {
      fr: "La FSR accueillera des chercheurs du monde entier pour discuter des avancées en IA.",
      ar: "ستستضيف الكلية باحثين من جميع أنحاء العالم لمناقشة التطورات في الذكاء الاصطناعي.",
      en: "FSR will host researchers from around the world to discuss advances in AI."
    },
    date: "2024-01-05",
    image: "/placeholder.svg",
    category: "event"
  },
  {
    id: '4',
    title: {
      fr: "Publication majeure en physique quantique",
      ar: "نشر بحث رئيسي في الفيزياء الكمية",
      en: "Major Publication in Quantum Physics"
    },
    excerpt: {
      fr: "Nos chercheurs publient dans Nature Physics une découverte révolutionnaire sur les qubits.",
      ar: "باحثونا ينشرون في Nature Physics اكتشافًا ثوريًا حول الكيوبتات.",
      en: "Our researchers publish a revolutionary discovery on qubits in Nature Physics."
    },
    date: "2024-01-03",
    image: "/placeholder.svg",
    category: "research"
  },
  {
    id: '5',
    title: {
      fr: "Nouveau partenariat avec l'Université de Montréal",
      ar: "شراكة جديدة مع جامعة مونتريال",
      en: "New Partnership with University of Montreal"
    },
    excerpt: {
      fr: "Un accord de coopération académique renforce les échanges étudiants et la recherche conjointe.",
      ar: "اتفاقية تعاون أكاديمي تعزز تبادل الطلاب والبحث المشترك.",
      en: "An academic cooperation agreement strengthens student exchanges and joint research."
    },
    date: "2023-12-28",
    image: "/placeholder.svg",
    category: "announcement"
  },
  {
    id: '6',
    title: {
      fr: "Journée portes ouvertes le 20 janvier",
      ar: "يوم الأبواب المفتوحة في 20 يناير",
      en: "Open Day on January 20th"
    },
    excerpt: {
      fr: "Venez découvrir nos campus, laboratoires et rencontrer nos enseignants-chercheurs.",
      ar: "تعالوا لاكتشاف حرمنا الجامعي ومختبراتنا ولقاء أساتذتنا الباحثين.",
      en: "Come discover our campus, laboratories and meet our faculty members."
    },
    date: "2023-12-20",
    image: "/placeholder.svg",
    category: "event"
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: {
      fr: "Conférence: L'avenir de l'énergie solaire au Maroc",
      ar: "مؤتمر: مستقبل الطاقة الشمسية في المغرب",
      en: "Conference: The Future of Solar Energy in Morocco"
    },
    description: {
      fr: "Rejoignez-nous pour une discussion sur les dernières innovations en énergie solaire.",
      ar: "انضموا إلينا لمناقشة أحدث الابتكارات في الطاقة الشمسية.",
      en: "Join us for a discussion on the latest innovations in solar energy."
    },
    date: "2024-02-15",
    time: "14:00",
    location: "Amphithéâtre A",
    type: "conference"
  },
  {
    id: '2',
    title: {
      fr: "Séminaire de recherche en mathématiques",
      ar: "ندوة بحثية في الرياضيات",
      en: "Mathematics Research Seminar"
    },
    description: {
      fr: "Présentation des travaux de recherche en algèbre et topologie.",
      ar: "عرض أعمال البحث في الجبر والطوبولوجيا.",
      en: "Presentation of research work in algebra and topology."
    },
    date: "2024-02-20",
    time: "10:00",
    location: "Salle de conférences B",
    type: "seminar"
  },
  {
    id: '3',
    title: {
      fr: "Atelier pratique: Introduction à Python",
      ar: "ورشة عملية: مقدمة في Python",
      en: "Practical Workshop: Introduction to Python"
    },
    description: {
      fr: "Un atelier pour les débutants souhaitant apprendre la programmation Python.",
      ar: "ورشة للمبتدئين الراغبين في تعلم برمجة Python.",
      en: "A workshop for beginners wanting to learn Python programming."
    },
    date: "2024-02-25",
    time: "09:00",
    location: "Salle informatique 101",
    type: "workshop"
  },
  {
    id: '4',
    title: {
      fr: "Cérémonie de remise des diplômes",
      ar: "حفل تسليم الشهادات",
      en: "Graduation Ceremony"
    },
    description: {
      fr: "Célébration des diplômés de la promotion 2024.",
      ar: "الاحتفال بخريجي دفعة 2024.",
      en: "Celebration of the 2024 graduating class."
    },
    date: "2024-07-10",
    time: "15:00",
    location: "Grand Amphithéâtre",
    type: "ceremony"
  }
];

export const mockPrograms: Program[] = [
  {
    id: '1',
    title: {
      fr: "Licence Sciences Mathématiques et Informatique",
      ar: "الإجازة في علوم الرياضيات والإعلاميات",
      en: "Bachelor in Mathematics and Computer Science"
    },
    description: {
      fr: "Formation fondamentale en mathématiques et informatique avec spécialisation progressive.",
      ar: "تكوين أساسي في الرياضيات والإعلاميات مع تخصص تدريجي.",
      en: "Fundamental training in mathematics and computer science with progressive specialization."
    },
    level: "licence",
    department: "Mathématiques & Informatique",
    duration: "3 ans",
    credits: 180
  },
  {
    id: '2',
    title: {
      fr: "Licence Sciences de la Vie",
      ar: "الإجازة في علوم الحياة",
      en: "Bachelor in Life Sciences"
    },
    description: {
      fr: "Étude des organismes vivants, de la biologie cellulaire à l'écologie.",
      ar: "دراسة الكائنات الحية، من البيولوجيا الخلوية إلى البيئة.",
      en: "Study of living organisms, from cell biology to ecology."
    },
    level: "licence",
    department: "Biologie",
    duration: "3 ans",
    credits: 180
  },
  {
    id: '3',
    title: {
      fr: "Licence Sciences de la Matière Physique",
      ar: "الإجازة في علوم المادة الفيزيائية",
      en: "Bachelor in Physical Sciences"
    },
    description: {
      fr: "Formation en physique fondamentale et appliquée avec travaux pratiques.",
      ar: "تكوين في الفيزياء الأساسية والتطبيقية مع أعمال تطبيقية.",
      en: "Training in fundamental and applied physics with practical work."
    },
    level: "licence",
    department: "Physique",
    duration: "3 ans",
    credits: 180
  },
  {
    id: '4',
    title: {
      fr: "Master Intelligence Artificielle et Science des Données",
      ar: "الماستر في الذكاء الاصطناعي وعلوم البيانات",
      en: "Master in Artificial Intelligence and Data Science"
    },
    description: {
      fr: "Formation avancée en IA, machine learning et analyse de données massives.",
      ar: "تكوين متقدم في الذكاء الاصطناعي والتعلم الآلي وتحليل البيانات الضخمة.",
      en: "Advanced training in AI, machine learning and big data analysis."
    },
    level: "master",
    department: "Informatique",
    duration: "2 ans",
    credits: 120
  },
  {
    id: '5',
    title: {
      fr: "Master Énergies Renouvelables et Efficacité Énergétique",
      ar: "الماستر في الطاقات المتجددة والكفاءة الطاقية",
      en: "Master in Renewable Energy and Energy Efficiency"
    },
    description: {
      fr: "Spécialisation dans les technologies vertes et la gestion durable de l'énergie.",
      ar: "تخصص في التكنولوجيات الخضراء والإدارة المستدامة للطاقة.",
      en: "Specialization in green technologies and sustainable energy management."
    },
    level: "master",
    department: "Physique",
    duration: "2 ans",
    credits: 120
  },
  {
    id: '6',
    title: {
      fr: "Doctorat en Sciences Chimiques",
      ar: "الدكتوراه في العلوم الكيميائية",
      en: "Doctorate in Chemical Sciences"
    },
    description: {
      fr: "Recherche avancée en chimie organique, inorganique ou physico-chimie.",
      ar: "بحث متقدم في الكيمياء العضوية أو غير العضوية أو الفيزيوكيميائية.",
      en: "Advanced research in organic, inorganic or physical chemistry."
    },
    level: "doctorat",
    department: "Chimie",
    duration: "3-4 ans"
  }
];

export const mockLabs: Lab[] = [
  {
    id: '1',
    name: {
      fr: "Laboratoire d'Informatique et de Modélisation",
      ar: "مختبر الإعلاميات والنمذجة",
      en: "Computer Science and Modeling Laboratory"
    },
    description: {
      fr: "Recherche en intelligence artificielle, big data et systèmes complexes.",
      ar: "البحث في الذكاء الاصطناعي والبيانات الضخمة والأنظمة المعقدة.",
      en: "Research in artificial intelligence, big data and complex systems."
    },
    director: "Pr. Ahmed Bennani",
    researchAreas: {
      fr: ["Intelligence Artificielle", "Machine Learning", "Systèmes Distribués", "Cybersécurité"],
      ar: ["الذكاء الاصطناعي", "التعلم الآلي", "الأنظمة الموزعة", "الأمن السيبراني"],
      en: ["Artificial Intelligence", "Machine Learning", "Distributed Systems", "Cybersecurity"]
    }
  },
  {
    id: '2',
    name: {
      fr: "Laboratoire de Physique des Matériaux",
      ar: "مختبر فيزياء المواد",
      en: "Materials Physics Laboratory"
    },
    description: {
      fr: "Étude des propriétés physiques des matériaux avancés et nanomatériaux.",
      ar: "دراسة الخصائص الفيزيائية للمواد المتقدمة والمواد النانوية.",
      en: "Study of physical properties of advanced materials and nanomaterials."
    },
    director: "Pr. Fatima Zahra Elhaj",
    researchAreas: {
      fr: ["Nanomatériaux", "Supraconductivité", "Physique du Solide", "Énergies Renouvelables"],
      ar: ["المواد النانوية", "فوق الموصلية", "فيزياء المواد الصلبة", "الطاقات المتجددة"],
      en: ["Nanomaterials", "Superconductivity", "Solid State Physics", "Renewable Energy"]
    }
  },
  {
    id: '3',
    name: {
      fr: "Centre de Recherche en Biotechnologie",
      ar: "مركز البحث في التكنولوجيا الحيوية",
      en: "Biotechnology Research Center"
    },
    description: {
      fr: "Développement de solutions biotechnologiques pour l'agriculture et la santé.",
      ar: "تطوير حلول التكنولوجيا الحيوية للزراعة والصحة.",
      en: "Development of biotechnological solutions for agriculture and health."
    },
    director: "Pr. Mohammed Alaoui",
    researchAreas: {
      fr: ["Génomique", "Biologie Moléculaire", "Biotechnologie Végétale", "Microbiologie"],
      ar: ["الجينوميات", "البيولوجيا الجزيئية", "التكنولوجيا الحيوية النباتية", "علم الأحياء الدقيقة"],
      en: ["Genomics", "Molecular Biology", "Plant Biotechnology", "Microbiology"]
    }
  }
];

export const mockServices: Service[] = [
  {
    id: '1',
    name: {
      fr: "Admissions",
      ar: "القبول",
      en: "Admissions"
    },
    description: {
      fr: "Procédures et informations pour les nouveaux étudiants",
      ar: "إجراءات ومعلومات للطلاب الجدد",
      en: "Procedures and information for new students"
    },
    icon: "UserPlus",
    link: "/contact"
  },
  {
    id: '2',
    name: {
      fr: "Scolarité",
      ar: "الشؤون الدراسية",
      en: "Registration Office"
    },
    description: {
      fr: "Gestion des inscriptions et dossiers étudiants",
      ar: "إدارة التسجيلات وملفات الطلاب",
      en: "Management of registrations and student files"
    },
    icon: "FileText",
    link: "/contact"
  },
  {
    id: '3',
    name: {
      fr: "Bourses",
      ar: "المنح",
      en: "Scholarships"
    },
    description: {
      fr: "Informations sur les bourses et aides financières",
      ar: "معلومات عن المنح والمساعدات المالية",
      en: "Information on scholarships and financial aid"
    },
    icon: "GraduationCap",
    link: "/student-life"
  },
  {
    id: '4',
    name: {
      fr: "Calendrier",
      ar: "التقويم",
      en: "Calendar"
    },
    description: {
      fr: "Calendrier académique et dates importantes",
      ar: "التقويم الأكاديمي والتواريخ المهمة",
      en: "Academic calendar and important dates"
    },
    icon: "Calendar",
    link: "/student-life"
  },
  {
    id: '5',
    name: {
      fr: "Clubs & Associations",
      ar: "الأندية والجمعيات",
      en: "Clubs & Associations"
    },
    description: {
      fr: "Vie associative et activités extra-scolaires",
      ar: "الحياة الجمعوية والأنشطة اللاصفية",
      en: "Student organizations and extracurricular activities"
    },
    icon: "Users",
    link: "/student-life"
  },
  {
    id: '6',
    name: {
      fr: "Bibliothèque",
      ar: "المكتبة",
      en: "Library"
    },
    description: {
      fr: "Ressources documentaires et espaces d'étude",
      ar: "الموارد الوثائقية ومساحات الدراسة",
      en: "Documentary resources and study spaces"
    },
    icon: "BookOpen",
    link: "/student-life"
  }
];

export const stats = {
  students: 12500,
  labs: 28,
  programs: 45,
  professors: 380
};
