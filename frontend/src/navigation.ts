import {
  BookOpen,
  CalendarRange,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Library,
  Presentation,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  path: string
  label: string
  title: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Dashboard', title: 'Dashboard', icon: LayoutDashboard },
  { path: '/alunos', label: 'Alunos', title: 'Alunos', icon: GraduationCap },
  { path: '/professores', label: 'Professores', title: 'Professores', icon: Presentation },
  { path: '/cursos', label: 'Cursos', title: 'Cursos', icon: Library },
  { path: '/disciplinas', label: 'Disciplinas', title: 'Disciplinas', icon: BookOpen },
  { path: '/ofertas-disciplinas', label: 'Ofertas', title: 'Ofertas de disciplinas', icon: CalendarRange },
  { path: '/matriculas', label: 'Matrículas', title: 'Matrículas', icon: ClipboardList },
]
