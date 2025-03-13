import { Turnstile } from "@marsidev/react-turnstile";

// NativeTokenMintView Component
type NativeTokenMintViewProps = {
  onSubmit: (cfToken: string) => Promise<void>;
};

export const NativeTokenMintView = ({ onSubmit }: NativeTokenMintViewProps) => {
  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-muted-foreground mb-4">
        Complete the captcha to mint native tokens:
      </p>
      <Turnstile
        options={{
          size: "normal",
        }}
        siteKey={import.meta.env.VITE_CF_KEY!}
        onSuccess={(cfToken) => void onSubmit(cfToken)}
      />
    </div>
  );
};
