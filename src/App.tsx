import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";
import Index from "./pages/Index";
import Lessons from "./pages/Lessons";
import Quizzes from "./pages/Quizzes";
import DigitalShield from "./pages/DigitalShield";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AdminOverview from "./pages/admin/Overview";
import AdminStudents from "./pages/admin/Students";
import AdminLessons from "./pages/admin/Lessons";
import AdminQuizzes from "./pages/admin/Quizzes";
import AdminInquiries from "./pages/admin/Inquiries";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/digital-shield" element={<DigitalShield />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="lessons" element={<AdminLessons />} />
            <Route path="quizzes" element={<AdminQuizzes />} />
            <Route path="inquiries" element={<AdminInquiries />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
