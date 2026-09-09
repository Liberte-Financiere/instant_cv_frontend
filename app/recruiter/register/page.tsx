'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Building2, Gift, Shield, Loader2, CheckCircle2, Phone, Globe, MapPin, FileText, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RecruiterRegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: '',
    companySector: '',
    companyPhone: '',
    companyCity: 'Ouagadougou',
    companyCountry: 'Burkina Faso',
    companyWebsite: '',
    companyTaxId: '',
    companySize: '1-10',
  });

  const [rejectionNotice, setRejectionNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetch('/api/recruiter/status')
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'APPROVED' || data.role === 'RECRUITER') {
            router.push('/recruiter');
          } else if (data.status === 'PENDING') {
            router.push('/recruiter/pending');
          } else if (data.status === 'REJECTED') {
            setRejectionNotice(data.rejectionReason || "Votre précédent dossier n'a pas été validé. Veuillez corriger vos informations.");
            if (data.company) {
              setFormData((prev) => ({
                ...prev,
                companyName: data.company.name || '',
                companySector: data.company.sector || '',
                companyPhone: data.company.phone || '',
                companyCity: data.company.city || 'Ouagadougou',
                companyCountry: data.company.country || 'Burkina Faso',
                companyWebsite: data.company.website || '',
                companyTaxId: data.company.taxId || '',
                companySize: data.company.size || '1-10',
              }));
            }
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingStatus(false));
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/recruiter/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'enregistrement du dossier");
        return;
      }
      router.push('/recruiter/pending');
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || isLoadingStatus) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto shadow-inner">
          <Building2 className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Devenir Recruteur sur Jobsira
        </h1>
        <p className="text-slate-600 text-sm max-w-lg mx-auto">
          Accédez à la CVthèque qualifiée et diffusez vos offres. Chaque entreprise est vérifiée manuellement par notre équipe sous 24h ouvrées.
        </p>
      </div>

      {rejectionNotice && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-1">Précisions demandées pour votre dossier :</p>
            <p className="text-amber-800 text-xs leading-relaxed">{rejectionNotice}</p>
          </div>
        </div>
      )}

      {/* Avantages */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Gift, title: '3 Déblocages offerts', text: 'Activés dès validation du compte', color: 'text-emerald-500' },
          { icon: Shield, title: 'Données protégées', text: 'Candidats réels et vérifiés', color: 'text-blue-500' },
          { icon: CheckCircle2, title: 'Validation sous 24h', text: 'Accompagnement dédié', color: 'text-purple-500' },
        ].map((item) => (
          <div key={item.title} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-center sm:text-left">
            <item.icon className={`w-6 h-6 ${item.color} mb-2 mx-auto sm:mx-0`} />
            <p className="font-bold text-slate-900 text-sm">{item.title}</p>
            <p className="text-slate-500 text-xs mt-0.5">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          Informations de votre entreprise
        </h2>

        {error && (
          <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Nom de l'entreprise */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nom de l'entreprise <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Ex: Coris Bank International, FASOTECH..."
                required
                minLength={2}
                maxLength={100}
                className="w-full h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Secteur d'activité */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Secteur d'activité <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="companySector"
              value={formData.companySector}
              onChange={handleChange}
              placeholder="Ex: Banque, Informatique, BTP..."
              required
              minLength={2}
              maxLength={100}
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Téléphone professionnel */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Téléphone pro (vérification) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                name="companyPhone"
                value={formData.companyPhone}
                onChange={handleChange}
                placeholder="Ex: +226 25 00 00 00"
                required
                minLength={6}
                maxLength={30}
                className="w-full h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Ville */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Ville <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="companyCity"
                value={formData.companyCity}
                onChange={handleChange}
                placeholder="Ex: Ouagadougou, Bobo..."
                required
                className="w-full h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Pays */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pays <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="companyCountry"
              value={formData.companyCountry}
              onChange={handleChange}
              placeholder="Ex: Burkina Faso, Côte d'Ivoire..."
              required
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Site Web ou page LinkedIn */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Site web ou lien LinkedIn <span className="text-slate-400 font-normal">(Optionnel)</span>
            </label>
            <div className="relative">
              <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Taille entreprise */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Taille de l'entreprise <span className="text-slate-400 font-normal">(Optionnel)</span>
            </label>
            <div className="relative">
              <Users className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="w-full h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="1-10">1 à 10 collaborateurs</option>
                <option value="11-50">11 à 50 collaborateurs</option>
                <option value="51-200">51 à 200 collaborateurs</option>
                <option value="201+">Plus de 200 collaborateurs</option>
              </select>
            </div>
          </div>

          {/* Numéro RCCM / IFU */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Identifiant fiscal / RCCM / IFU <span className="text-slate-400 font-normal">(Optionnel pour un début)</span>
            </label>
            <div className="relative">
              <FileText className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="companyTaxId"
                value={formData.companyTaxId}
                onChange={handleChange}
                placeholder="Ex: BF-OUA-01-2023-B12-00000 ou N° IFU"
                className="w-full h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Renseigner votre RCCM accélère la validation manuelle de votre dossier.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !formData.companyName.trim() || !formData.companyPhone.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-base rounded-xl shadow-lg shadow-blue-500/25 transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Envoi du dossier en cours...
            </>
          ) : (
            <>
              <Building2 className="w-5 h-5 mr-2" />
              Soumettre mon dossier de recruteur
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
