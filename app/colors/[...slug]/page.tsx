import { redirect } from "next/navigation";

export default async function CatchAllColorPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const hex = slug.join('');
  
  // Validate if it's a hex color pattern
  if (/^[0-9a-fA-F]{3,6}$/.test(hex)) {
    // Redirect to the universal picker page
    redirect(`/colors/picker?hex=${hex}`);
  }
  
  // For non-hex paths, redirect to colors library
  redirect('/colors');
}