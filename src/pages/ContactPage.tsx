import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Twitter, Facebook, Linkedin, Youtube } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    showToast('Message sent successfully! We will get back to you soon.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">Have a story to share or a question? We would love to hear from you.</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.name ? 'border-red-500' : 'border-slate-300'}`} placeholder="John Doe" />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.email ? 'border-red-500' : 'border-slate-300'}`} placeholder="john@example.com" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.subject ? 'border-red-500' : 'border-slate-300'}`} placeholder="What is this about?" />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={5}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none ${errors.message ? 'border-red-500' : 'border-slate-300'}`} placeholder="Tell us more..." />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                  {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <><Send className="w-5 h-5" />Send Message</>}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-sky-600" /></div>
                  <div><p className="font-medium text-slate-900">Email</p><a href="mailto:contact@newshub.com" className="text-sky-600 hover:underline">contact@newshub.com</a></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-sky-600" /></div>
                  <div><p className="font-medium text-slate-900">Phone</p><a href="tel:+1234567890" className="text-sky-600 hover:underline">+1 (234) 567-890</a></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-sky-600" /></div>
                  <div><p className="font-medium text-slate-900">Address</p><p className="text-slate-600">123 News Street, Media City, MC 12345</p></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a href="#" className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-sky-600 hover:text-white text-slate-600 transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-sky-600 hover:text-white text-slate-600 transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-sky-600 hover:text-white text-slate-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
                <a href="#" className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-sky-600 hover:text-white text-slate-600 transition-colors"><Youtube className="w-5 h-5" /></a>
              </div>
            </div>

            <div className="bg-slate-200 rounded-2xl p-8">
              <div className="flex items-center gap-2 text-slate-500 mb-2"><MapPin className="w-4 h-4" /><span className="text-sm font-medium">Our Location</span></div>
              <div className="aspect-video bg-slate-300 rounded-lg flex items-center justify-center text-slate-500">Map Placeholder</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
