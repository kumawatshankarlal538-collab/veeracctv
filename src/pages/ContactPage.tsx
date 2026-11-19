import React, { useEffect, useState } from 'react';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';

interface ContactPageProps {
  prefilledService?: string;
}

export function ContactPage({ prefilledService = '' }: ContactPageProps) {
  const { siteSettings, services, submitInquiry } = useCatalog();
  const { user } = useAuth();

  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [serviceType, setServiceType] = useState(prefilledService || 'CCTV Installation');
  const [propertyType, setPropertyType] = useState('Commercial Office');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefilledService) {
      setServiceType(prefilledService);
    }
  }, [prefilledService]);

  useEffect(() => {
    if (user) {
      setName((prev) => prev || user.displayName);
      setEmail((prev) => prev || user.email);
      setPhone((prev) => prev || user.phone);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (name.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (phone.trim().length < 6) {
      setErrorMsg('Please enter a valid phone or WhatsApp number.');
      return;
    }
    if (message.trim().length < 5) {
      setErrorMsg('Please describe your property or camera requirements.');
      return;
    }

    setSubmitting(true);
    try {
      await submitInquiry({
        name,
        email,
        phone,
        serviceType,
        propertyType,
        message,
      });
      setSubmitted(true);
      setMessage('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappClean = (siteSettings.whatsapp || '919829044510').replace(/[^0-9]/g, '');

  return (
    <div className="bg-[#060B16] text-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="w-10 h-0.5 bg-red-600 mb-3" />
          <p className="text-xs font-semibold tracking-[0.18em] text-red-400 mb-2">
            GET IN TOUCH
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Request a Free CCTV Site Survey & Quote
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            Share your site details below. Our security engineers respond within 2 business hours with camera count estimates and brand options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0B1221] border border-white/10 p-7 chamfer-corner space-y-6">
              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-slate-400">Direct Sales & Support</div>
                  <div className="text-base font-bold font-mono text-white tabular-nums mt-0.5">
                    {siteSettings.phone}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-slate-400">Email Inquiries</div>
                  <div className="text-base font-semibold text-white mt-0.5">
                    {siteSettings.email}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-slate-400">Headquarters</div>
                  <div className="text-sm text-slate-200 mt-0.5 leading-relaxed">
                    {siteSettings.address}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <a
                  href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent(
                    'Hello VEERA CCTV, I need a free CCTV installation quote.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Directly on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Validated Quote Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#0B1221] border border-white/10 p-7 sm:p-9 chamfer-card-lg">
              {submitted ? (
                <div className="py-10 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Quote Request Received</h2>
                  <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
                    Thank you! Your inquiry has been logged in our engineering dispatch system. A VEERA CCTV specialist will contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="p-3.5 bg-red-950/60 border border-red-500/50 text-xs text-red-200">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Arvind Kumar"
                        className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98290 00000"
                        className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Property Type
                      </label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="Commercial Office">Commercial Office</option>
                        <option value="Warehouse / Logistics">Warehouse / Logistics</option>
                        <option value="Hotel / Hospitality">Hotel / Hospitality</option>
                        <option value="Residential Villa / Apartment">Residential Villa / Apartment</option>
                        <option value="School / Campus">School / Campus</option>
                        <option value="Retail Store">Retail Store</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Service or Product Interest
                    </label>
                    <input
                      type="text"
                      list="veera-services-list"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                    <datalist id="veera-services-list">
                      {services.map((s) => (
                        <option key={s.id} value={s.title} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Site Requirements & Camera Count
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe indoor/outdoor areas, estimated camera count, recording days needed..."
                      className="w-full px-3.5 py-2.5 bg-[#060B16] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-semibold tracking-wide transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Sending Request...' : 'Submit Free Quote Request'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
