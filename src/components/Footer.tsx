export default function Footer() {
  return (
    <footer className=" bottom-0 left-0 w-full bg-gray-900 text-gray-400 text-sm text-center py-2 border-t border-gray-800 z-50">
      © {new Date().getFullYear()} CSMJU Finance – จัดการการเงินง่าย ๆ ของคุณ
      <p>
            Powered by{" "}
            <a
              href="https://www.cs.mju.ac.th/home"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Computer Science Maejo University
            </a>
          </p>
    </footer>
  );
}