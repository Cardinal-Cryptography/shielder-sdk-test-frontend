import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import MnemonicConfig from "@/components/ConfigSection/MnemonicConfig";

const ConfigSection = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  return (
    <div className="">
      {/* Toggle Button for Mobile */}
      <Button
        className="md:hidden fixed top-1 right-2 z-50 font-semibold text-xs w-20 h-8"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        Config {isMobileMenuOpen ? <ArrowLeftCircle /> : <ArrowRightCircle />}
      </Button>
      {/* Config Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 bg-gray-50 border-l p-4 space-y-8
          z-40 transform transition-transform duration-300 ease-in-out
          overflow-y-auto
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          md:static md:translate-x-0 md:h-[95vh] md:flex
        `}
      >
        <div className="w-full" ref={formRef}>
          <h1 className="text-xl font-bold mb-4">Configuration</h1>
          <MnemonicConfig />
          <Button
            className="w-full mb-4 mt-8"
            onClick={async () => {
              if (
                window.confirm(
                  "Are you sure you want to reset the whole app? Remember to save your seed mnemonic!",
                )
              ) {
                localStorage.clear();
                // reload the page
                window.location.reload();
              }
            }}
            variant="destructive"
          >
            Reset the whole app
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfigSection;
