'use client';

import { ApplicationForm } from '@/components/site/application-form';
import Navbar from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';

export default function ApplyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-20">
        <ApplicationForm />
      </main>
      <Footer />
    </div>
  );
}
