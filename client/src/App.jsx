import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useInactivityLogout } from './hooks/useInactivityLogout';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import CookieBanner from './components/common/CookieBanner';
import Toast from './components/ui/Toast';
import Spinner from './components/ui/Spinner';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const UserDashboardPage = lazy(() => import('./pages/UserDashboardPage'));
const StorePage = lazy(() => import('./pages/StorePage'));
const BookDetailPage = lazy(() => import('./pages/BookDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const LegalNoticePage = lazy(() => import('./pages/LegalNoticePage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminMediaPage = lazy(() => import('./pages/AdminMediaPage'));
const AdminAvailabilityPage = lazy(() => import('./pages/AdminAvailabilityPage'));
const AdminAppointmentsPage = lazy(() => import('./pages/AdminAppointmentsPage'));
const AdminBooksPage = lazy(() => import('./pages/AdminBooksPage'));
const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage'));
const AdminSettingsPage = lazy(() => import('./pages/AdminSettingsPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const AdminAuditPage = lazy(() => import('./pages/AdminAuditPage'));
const AdminTestimonialsPage = lazy(() => import('./pages/AdminTestimonialsPage'));
const AdminCouponsPage = lazy(() => import('./pages/AdminCouponsPage'));
const AdminFinancialPage = lazy(() => import('./pages/AdminFinancialPage'));
const AdminSessionNotesPage = lazy(() => import('./pages/AdminSessionNotesPage'));
const AdminAlbumPage = lazy(() => import('./pages/AdminAlbumPage'));
const AdminHealthPage = lazy(() => import('./pages/AdminHealthPage'));
const AdminBlogPage = lazy(() => import('./pages/AdminBlogPage'));

function PageLoader() {
  return <Spinner className="py-20" />;
}

export default function App() {
  useInactivityLogout();

  return (
    <>
      <Toast />
      <CookieBanner />
      <Suspense fallback={<PageLoader />}>
        <ErrorBoundary>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/legal" element={<LegalNoticePage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/store/:slug" element={<BookDetailPage />} />
              <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
            </Route>

            <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
              <Route path="/admin/availability" element={<AdminAvailabilityPage />} />
              <Route path="/admin/media" element={<AdminMediaPage />} />
              <Route path="/admin/books" element={<AdminBooksPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/coupons" element={<AdminCouponsPage />} />
              <Route path="/admin/financial" element={<AdminFinancialPage />} />
              <Route path="/admin/session-notes" element={<AdminSessionNotesPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/audit" element={<AdminAuditPage />} />
              <Route path="/admin/testimonials" element={<AdminTestimonialsPage />} />
              <Route path="/admin/album" element={<AdminAlbumPage />} />
              <Route path="/admin/health" element={<AdminHealthPage />} />
              <Route path="/admin/blog" element={<AdminBlogPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </>
  );
}
