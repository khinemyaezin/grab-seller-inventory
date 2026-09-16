import { Header } from "@khinemyaezin/seller-ui/layout/header";

export default function CoveragePage() {
  return (
    <div className="container mx-auto max-w-5xl p-6">
      <Header
        title="Stock coverage"
        description="Find unstocked variants, zero-available, and low-stock gaps for a location."
      />
    </div>
  );
}
