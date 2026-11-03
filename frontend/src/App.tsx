import { Link, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import { ToastProvider } from './components/ui/Toast'
import { SearchProvider } from './hooks/useTopbarSearch'
import Dashboard from './pages/Dashboard'
import AlunosPage from './pages/AlunosPage'
import ProfessoresPage from './pages/ProfessoresPage'
import CursosPage from './pages/CursosPage'
import DisciplinasPage from './pages/DisciplinasPage'
import OfertasPage from './pages/OfertasPage'
import MatriculasPage from './pages/MatriculasPage'

function NotFound() {
  return (
    <div className="rounded-xl border border-line bg-surface px-6 py-14 text-center shadow-card">
      <h2 className="font-serif text-2xl font-semibold">Página não encontrada</h2>
      <p className="mt-2 text-sm text-muted">O endereço acessado não existe neste sistema.</p>
      <Link to="/" className="mt-5 inline-block text-sm font-medium text-brand underline">
        Voltar ao Dashboard
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <SearchProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="alunos" element={<AlunosPage />} />
            <Route path="professores" element={<ProfessoresPage />} />
            <Route path="cursos" element={<CursosPage />} />
            <Route path="disciplinas" element={<DisciplinasPage />} />
            <Route path="ofertas-disciplinas" element={<OfertasPage />} />
            <Route path="matriculas" element={<MatriculasPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </SearchProvider>
    </ToastProvider>
  )
}
