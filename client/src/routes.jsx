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
import Calculators from './pages/Calculators';
import CreatinineClearance from './pages/calculators/CreatinineClearance';
import BMICalculator from './pages/calculators/BMICalculator';
import HeartRiskCalculator from './pages/calculators/HeartRiskCalculator';
import BloodPressureMonitor from './pages/calculators/BloodPressureMonitor';
import DiabetesRiskCalculator from './pages/calculators/DiabetesRiskCalculator';
import PregnancyCalculator from './pages/calculators/PregnancyCalculator';
import MedicationDosageCalculator from './pages/calculators/MedicationDosageCalculator';
import CalorieCalculator from './pages/calculators/CalorieCalculator';
import MentalHealthAssessment from './pages/calculators/MentalHealthAssessment';
import VaccinationSchedule from './pages/calculators/VaccinationSchedule';
import DrugInteractionChecker from './pages/calculators/DrugInteractionChecker';
import AgeCalculator from './pages/calculators/AgeCalculator';
import WellsDVTCalculator from './pages/calculators/WellsDVTCalculator';
import GlasgowComaScale from './pages/calculators/GlasgowComaScale';
import GuptaMICACalculator from './pages/calculators/GuptaMICACalculator';
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
    path: '/calculators',
    element: (
      <Layout>
        <Calculators />
      </Layout>
    ),
  },
  {
    path: '/calculators/creatinine-clearance',
    element: (
      <Layout>
        <CreatinineClearance />
      </Layout>
    ),
  },
  {
    path: '/calculators/bmi',
    element: (
      <Layout>
        <BMICalculator />
      </Layout>
    ),
  },
  {
    path: '/calculators/heart-risk',
    element: (
      <Layout>
        <HeartRiskCalculator />
      </Layout>
    ),
  },
  {
    path: '/calculators/blood-pressure',
    element: (
      <Layout>
        <BloodPressureMonitor />
      </Layout>
    ),
  },
  {
    path: '/calculators/diabetes-risk',
    element: (
      <Layout>
        <DiabetesRiskCalculator />
      </Layout>
    ),
  },
  {
    path: '/calculators/pregnancy',
    element: (
      <Layout>
        <PregnancyCalculator />
      </Layout>
    ),
  },
  {
    path: '/calculators/medication-dosage',
    element: (
      <Layout>
        <MedicationDosageCalculator />
      </Layout>
    ),
  },
  {
    path: '/calculators/calorie',
    element: (
      <Layout>
        <CalorieCalculator />
      </Layout>
    ),
  },
  {
    path: '/calculators/mental-health',
    element: (
      <Layout>
        <MentalHealthAssessment />
      </Layout>
    ),
  },
  {
    path: '/calculators/vaccination',
    element: (
      <Layout>
        <VaccinationSchedule />
      </Layout>
    ),
  },
  {
    path: '/calculators/drug-interaction',
    element: (
      <Layout>
        <DrugInteractionChecker />
      </Layout>
    ),
  },
  {
    path: '/calculators/age',
    element: (
      <Layout>
        <AgeCalculator />
      </Layout>
    ),
  },
  {
    path: '/calculators/wells-dvt',
    element: (
      <Layout>
        <WellsDVTCalculator />
      </Layout>
    ),
  },
  {
    path: '/calculators/glasgow-coma-scale',
    element: (
      <Layout>
        <GlasgowComaScale />
      </Layout>
    ),
  },
  {
    path: '/calculators/gupta-mica',
    element: (
      <Layout>
        <GuptaMICACalculator />
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

