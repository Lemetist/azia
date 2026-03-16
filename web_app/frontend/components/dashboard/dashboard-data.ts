export const sidebarItems = [
  { href: "/", label: "Обзор", key: "overview" },
  { href: "/schedule", label: "Расписание", key: "schedule" },
  { href: "/coaches", label: "Тренеры", key: "coaches" },
  { href: "/progress", label: "Прогресс", key: "progress" },
  { href: "/membership", label: "Абонемент", key: "membership" },
  { href: "/profile", label: "Профиль", key: "profile" },
] as const;

export const statCards = [
  { label: "Weekly load", value: "12.4h", change: "+8%", tone: "accent" },
  { label: "Calories burned", value: "8,420", change: "+11%", tone: "neutral" },
  { label: "Recovery score", value: "84%", change: "Stable", tone: "neutral" },
];

export const nextWorkouts = [
  {
    title: "Strength block",
    coach: "Marcus Bell",
    time: "Today, 18:30",
    tag: "Upper body",
  },
  {
    title: "Pool conditioning",
    coach: "Nina Park",
    time: "Tomorrow, 07:15",
    tag: "45 min",
  },
  {
    title: "Tempo run",
    coach: "Arseniy Volk",
    time: "Tue, 06:45",
    tag: "8 km",
  },
];

export const scheduleDays = [
  {
    day: "Пн",
    sessions: [
      { time: "06:45", title: "Беговой клуб", meta: "8 км на улице", spots: "12 мест" },
      { time: "18:30", title: "Силовая тренировка", meta: "Зал A", spots: "4 места" },
    ],
  },
  {
    day: "Вт",
    sessions: [
      { time: "07:15", title: "Тренировка в бассейне", meta: "Дорожка 3", spots: "7 мест" },
      { time: "19:00", title: "Основы бокса", meta: "Зона единоборств", spots: "2 места" },
    ],
  },
  {
    day: "Ср",
    sessions: [
      { time: "08:00", title: "Мобилити-сессия", meta: "Зона восстановления", spots: "16 мест" },
      { time: "18:00", title: "Функциональный круг", meta: "Основной зал", spots: "5 мест" },
    ],
  },
];

export const coaches = [
  {
    name: "Marcus Bell",
    role: "Силовой тренер",
    focus: "Гипертрофия, техника со штангой, планирование циклов",
    image: "/images/gym-reference.jpg",
  },
  {
    name: "Nina Park",
    role: "Тренер по плаванию",
    focus: "Блоки на выносливость, контроль дыхания, темп восстановления",
    image: "/images/gym-bg.png",
  },
  {
    name: "Arseniy Volk",
    role: "Тренер по бегу",
    focus: "Пороговая работа, каденс, подготовка к старту",
    image: "/images/gym-reference.jpg",
  },
];

export const milestones = [
  { label: "Вес", current: "78 кг", target: "74 кг" },
  { label: "VO2 max", current: "49", target: "54" },
  { label: "Жим лежа", current: "92 кг", target: "105 кг" },
];

export const plans = [
  {
    name: "Элитный доступ",
    price: "$89/мес.",
    description: "Безлимитный вход в зал, 8 тренировок с тренером, доступ в зону восстановления",
    status: "Текущий тариф",
  },
  {
    name: "Performance+",
    price: "$129/мес.",
    description: "Все из тарифа «Элитный доступ» плюс разбор питания и аналитика по трекеру",
    status: "Рекомендуем",
  },
];

export const profileFacts = [
  { label: "Цель", value: "Рекомпозиция + забег 10 км в июне" },
  { label: "Посещаемость", value: "19 занятий в этом месяце" },
  { label: "Продление", value: "12 апреля 2026" },
];
