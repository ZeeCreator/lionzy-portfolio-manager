
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Admin Pages
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import AdminProjects from "./pages/Admin/Projects";
import Skills from "./pages/Admin/Skills";
import Messages from "./pages/Admin/Messages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-16">
                  <Index />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/projects"
            element={
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-16">
                  <Projects />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-16">
                  <ProjectDetail />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/about"
            element={
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-16">
                  <About />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/contact"
            element={
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-16">
                  <Contact />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/settings"
            element={
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-16">
                  <Settings />
                </main>
                <Footer />
              </div>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminProjects />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="skills" element={<Skills />} />
            <Route path="messages" element={<Messages />} />
          </Route>

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-16">
                  <NotFound />
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
