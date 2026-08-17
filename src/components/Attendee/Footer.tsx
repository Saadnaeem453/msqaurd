const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0a0b0e] border-t-[0.5px] border-secondary/10 py-6 mt-8">
      <div className="app-container mx-auto max-w-384 flex flex-col md:flex-row justify-between items-center gap-4">        <span className="text-secondary text-sm">
          UMMAH EVENTS © {currentYear}. Premium Community Discovery.
        </span>
        <div className="flex gap-6 text-secondary text-sm">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;