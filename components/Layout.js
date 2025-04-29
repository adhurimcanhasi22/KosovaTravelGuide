import Navbar from './Navbar';
import Footer from './Footer';
import AIChatbot from './AIChatbot';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <AIChatbot />
    </div>
  );
}
