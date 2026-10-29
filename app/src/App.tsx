import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import Admin from './pages/Admin'
import Categories from './pages/Categories'
import CategoryDetail from './pages/CategoryDetail'
import Cities from './pages/Cities'
import CityDetail from './pages/CityDetail'
import Explore from './pages/Explore'
import Home from './pages/Home'
import Login from './pages/Login'
import MyHistory from './pages/MyHistory'
import MyList from './pages/MyList'
import NotFound from './pages/NotFound'
import ProducerDetail from './pages/ProducerDetail'
import Producers from './pages/Producers'
import Register from './pages/Register'
import Search from './pages/Search'
import VideoDetail from './pages/VideoDetail'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explorar" element={<Explore />} />
              <Route path="/video/:slug" element={<VideoDetail />} />
              <Route path="/categorias" element={<Categories />} />
              <Route path="/categoria/:slug" element={<CategoryDetail />} />
              <Route path="/cidades" element={<Cities />} />
              <Route path="/cidade/:slug" element={<CityDetail />} />
              <Route path="/produtores" element={<Producers />} />
              <Route path="/produtor/:slug" element={<ProducerDetail />} />
              <Route path="/busca" element={<Search />} />
              <Route path="/minha-lista" element={<MyList />} />
              <Route path="/historico" element={<MyHistory />} />
              <Route path="/entrar" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
