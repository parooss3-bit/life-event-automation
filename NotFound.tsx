import { Link } from 'wouter'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container py-20 text-center">
        <h1 className="font-[Fraunces] text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
      </div>
      <Footer />
    </div>
  )
}
