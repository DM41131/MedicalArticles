import { Navigate } from 'react-router-dom';
import { useAuth } from './store/useAuth';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleView from './pages/ArticleView';
import Categories from './pages/Categories';
import Search from './pages/Search';
import Login from './pages/Login';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ArticleEditor from './pages/admin/ArticleEditor';
import ArticlesManager from './pages/admin/ArticlesManager';
import CategoriesManager from './pages/admin/CategoriesManager';
import NavigationManager from './pages/admin/NavigationManager';

// Protected Route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout wrapper
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 128px)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
};

export const routes = [
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/articles',
    element: (
      <Layout>
        <Articles />
      </Layout>
    ),
  },
  {
    path: '/articles/:id',
    element: (
      <Layout>
        <ArticleView />
      </Layout>
    ),
  },
  {
    path: '/categories',
    element: (
      <Layout>
        <Categories />
      </Layout>
    ),
  },
  {
    path: '/search',
    element: (
      <Layout>
        <Search />
      </Layout>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/articles',
    element: (
      <ProtectedRoute adminOnly>
        <Layout>
          <ArticlesManager />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/articles/new',
    element: (
      <ProtectedRoute adminOnly>
        <Layout>
          <ArticleEditor />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/articles/:id/edit',
    element: (
      <ProtectedRoute adminOnly>
        <Layout>
          <ArticleEditor />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/categories',
    element: (
      <ProtectedRoute adminOnly>
        <Layout>
          <CategoriesManager />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/navigation',
    element: (
      <ProtectedRoute adminOnly>
        <Layout>
          <NavigationManager />
        </Layout>
      </ProtectedRoute>
    ),
  },
];

