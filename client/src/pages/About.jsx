import React from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Heart, Leaf, Users } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 z-10" />
        <img
          src="https://images.unsplash.com/photo-1761746395622-5f7e0e7b4ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduJTIwc3R1ZGlvJTIwd29ya3NwYWNlfGVufDF8fHx8MTc2OTk2MzM4Nnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="About Linces'CKF"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium mb-4">
            {t('about.hero.title')}
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            {t('about.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-medium text-navy mb-4">
            {t('about.story.title')}
          </h2>
        </div>
        <div className="space-y-6 text-navy/70">
          <p className="text-lg leading-relaxed">
            {t('about.story.paragraph1')}
          </p>
          <p className="text-lg leading-relaxed">
            {t('about.story.paragraph2')}
          </p>
          <p className="text-lg leading-relaxed">
            {t('about.story.paragraph3')}
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-medium text-navy mb-4">
              {t('about.values.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">
                {t('about.values.excellence.title')}
              </h3>
              <p className="text-navy/60 text-sm leading-relaxed">
                {t('about.values.excellence.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">
                {t('about.values.sustainability.title')}
              </h3>
              <p className="text-navy/60 text-sm leading-relaxed">
                {t('about.values.sustainability.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">
                {t('about.values.craftsmanship.title')}
              </h3>
              <p className="text-navy/60 text-sm leading-relaxed">
                {t('about.values.craftsmanship.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">
                {t('about.values.partnership.title')}
              </h3>
              <p className="text-navy/60 text-sm leading-relaxed">
                {t('about.values.partnership.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-medium text-navy mb-4">
            {t('about.team.title')}
          </h2>
          <p className="text-navy/70 max-w-2xl mx-auto text-lg">
            {t('about.team.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { role: t('about.team.roles.artisans'), count: '25+', description: t('about.team.roles.artisansDesc') },
            { role: t('about.team.roles.design'), count: '10+', description: t('about.team.roles.designDesc') },
            { role: t('about.team.roles.quality'), count: '8+', description: t('about.team.roles.qualityDesc') },
          ].map((team, index) => (
            <div key={index} className="bg-white rounded-lg border border-navy/20 p-6 text-center">
              <div className="text-4xl font-bold text-navy mb-2">{team.count}</div>
              <h3 className="text-lg font-semibold text-navy mb-2">{team.role}</h3>
              <p className="text-navy/60 text-sm leading-relaxed">{team.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">38+</div>
              <p className="text-sm text-white/70">{t('about.stats.experience')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-sm text-white/70">{t('about.stats.partners')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <p className="text-sm text-white/70">{t('about.stats.customers')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-sm text-white/70">{t('about.stats.quality')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}