import { useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from './lib/supabase.js';

const pillars = [
  { number: '01', title: 'Management', label: 'Strategy & organisational performance', description: 'Practical strategy, organisational development, governance, and operational improvement that help teams turn ambition into measurable progress.', services: ['Strategic planning', 'Organisational development', 'Programme design & evaluation'] },
  { number: '02', title: 'Medicine', label: 'Clinical research & health systems', description: 'Research-minded support for health organisations, innovators, and partners working to improve evidence, service delivery, and health outcomes.', services: ['Clinical research support', 'Health systems strengthening', 'Research partnerships'] },
  { number: '03', title: 'Markets', label: 'Business development & market entry', description: 'Partnership building and market-entry support to help ideas, services, and organisations identify opportunities and grow across borders.', services: ['Business development', 'Market-entry planning', 'Strategic partnerships'] },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="site-header">
    <a className="brand" href="#home" aria-label="3M Paradigms home">
      <span className="brand-mark">3M<span>.</span></span>
      <span className="brand-name">PARADIGMS<small>CONSULTING GROUP</small></span>
    </a>
    <button className="menu-toggle" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '✕' : '☰'}</button>
    <nav className={menuOpen ? 'nav nav-open' : 'nav'} onClick={() => setMenuOpen(false)}>
      <a href="#services">Our expertise</a><a href="#approach">Our approach</a><a href="#about">About us</a><a className="nav-cta" href="#contact">Start a conversation <span>↗</span></a>
    </nav>
  </header>;
}

function ContactForm() {
  const [form, setForm] = useState({ full_name: '', email: '', organization: '', service_interest: 'Management', message: '' });
  const [state, setState] = useState({ loading: false, error: '', success: '' });
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, error: '', success: '' });
    if (!supabaseConfigured || !supabase) {
      setState({ loading: false, error: 'The contact form is not connected yet. Please email us directly while the site setup is completed.', success: '' });
      return;
    }
    const { error } = await supabase.from('inquiries').insert([form]);
    if (error) {
      setState({ loading: false, error: 'Your message could not be sent just now. Please try again later or email us directly.', success: '' });
      return;
    }
    setForm({ full_name: '', email: '', organization: '', service_interest: 'Management', message: '' });
    setState({ loading: false, error: '', success: 'Thank you. Your enquiry has been received.' });
  }
  return <form className="contact-form" onSubmit={submit}>
    <div className="form-row">
      <label>Full name<input name="full_name" value={form.full_name} onChange={update} placeholder="Your name" required minLength="2" maxLength="120" /></label>
      <label>Work email<input name="email" type="email" value={form.email} onChange={update} placeholder="you@organisation.com" required maxLength="254" /></label>
    </div>
    <label>Organisation <span className="optional">(optional)</span><input name="organization" value={form.organization} onChange={update} placeholder="Company or institution" maxLength="180" /></label>
    <label>Area of interest<select name="service_interest" value={form.service_interest} onChange={update}><option>Management</option><option>Medicine</option><option>Markets</option><option>Partnerships</option><option>Other</option></select></label>
    <label>How can we help?<textarea name="message" value={form.message} onChange={update} placeholder="Tell us a little about your goals or challenge..." required minLength="10" maxLength="5000" rows="5" /></label>
    <button className="button button-primary form-submit" type="submit" disabled={state.loading}>{state.loading ? 'Sending…' : 'Send your enquiry'} <span>↗</span></button>
    {state.success && <p className="form-success" role="status">{state.success}</p>}
    {state.error && <p className="form-error" role="alert">{state.error}</p>}
    <p className="form-note">Your information will be used to respond to your enquiry.</p>
  </form>;
}

function Services() {
  const [services, setServices] = useState([]);
  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;
    let alive = true;
    supabase.from('services').select('*').limit(9).then(({ data }) => {
      if (alive && data?.length) setServices(data);
    });
    return () => { alive = false; };
  }, []);
  const cards = pillars.map((pillar) => {
    const related = services.filter((service) => {
      const text = [service.title, service.name, service.category, service.pillar, service.slug].filter(Boolean).join(' ').toLowerCase();
      return text.includes(pillar.title.toLowerCase()) || (pillar.title === 'Management' && text.includes('strateg')) || (pillar.title === 'Medicine' && (text.includes('clinical') || text.includes('health'))) || (pillar.title === 'Markets' && (text.includes('business') || text.includes('market')));
    });
    return { ...pillar, dynamic: related };
  });
  return <div className="service-grid">{cards.map((pillar) => <article className="service-card" key={pillar.title}>
    <div className="service-card-top"><span className="service-number">{pillar.number}</span><span className="service-arrow">↗</span></div>
    <p className="eyebrow">{pillar.label}</p><h3>{pillar.title}</h3><p className="service-description">{pillar.description}</p>
    <ul>{(pillar.dynamic.length ? pillar.dynamic.map((s) => s.title || s.name).filter(Boolean).slice(0, 3) : pillar.services).map((item) => <li key={item}>{item}</li>)}</ul>
    <a className="text-link" href="#contact" onClick={() => {}}>Discuss this service <span>→</span></a>
  </article>)}</div>;
}

export default function App() {
  return <div>
    <Header />
    <main>
      <section className="hero" id="home">
        <div className="hero-glow" aria-hidden="true"></div>
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow"><span className="status-dot"></span> Insight. Integrity. Impact.</p>
          <h1>Transforming<br /><em>knowledge</em> into<br />lasting impact.</h1>
          <p className="hero-copy">We connect strategy, health research, and market opportunity to help organisations solve meaningful challenges and build what comes next.</p>
          <div className="hero-actions"><a className="button button-light" href="#services">Explore our expertise <span>↘</span></a><a className="button button-quiet" href="#about">Get to know us <span>→</span></a></div>
          <div className="hero-footnote"><span>GHANA</span><span className="footnote-line"></span><span>WORKING ACROSS BORDERS</span></div>
        </div>
        <div className="hero-art" aria-label="Abstract geometric illustration representing connected ideas">
          <div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div><div className="art-orbit orbit-three"></div>
          <div className="art-core"><span>3M</span><small>PARADIGMS</small></div>
          <span className="art-node node-one">M</span><span className="art-node node-two">M</span><span className="art-node node-three">M</span>
          <span className="art-caption">THREE PILLARS. ONE PURPOSE.</span>
        </div>
        <div className="hero-bottom"><span>STRATEGY</span><span>×</span><span>SCIENCE</span><span>×</span><span>OPPORTUNITY</span></div>
      </section>

      <section className="intro section-wrap" id="about">
        <div className="section-kicker"><span>01 / WHO WE ARE</span><span className="kicker-line"></span></div>
        <div className="intro-grid"><h2>Complex challenges<br />need <em>connected thinking.</em></h2><div className="intro-copy"><p>3M Paradigms Consulting Group is a multidisciplinary consultancy built around a simple belief: meaningful progress happens when sound thinking meets practical action.</p><p>We bring together management insight, medical and research perspectives, and market understanding to help people and organisations move from ideas to outcomes.</p><a className="text-link" href="#contact">Let's explore what is possible <span>→</span></a></div></div>
      </section>

      <section className="services-section section-wrap" id="services">
        <div className="section-kicker"><span>02 / OUR EXPERTISE</span><span className="kicker-line"></span><span>THREE CONNECTED PILLARS</span></div>
        <div className="section-heading"><h2>One partner.<br /><em>Three perspectives.</em></h2><p>Flexible expertise for organisations navigating change, generating evidence, and pursuing growth.</p></div>
        <Services />
      </section>

      <section className="approach-section" id="approach">
        <div className="approach-inner section-wrap">
          <div className="section-kicker"><span>03 / HOW WE WORK</span><span className="kicker-line"></span></div>
          <div className="approach-grid"><div><p className="eyebrow">A PRACTICAL PARTNERSHIP</p><h2>From insight<br />to <em>implementation.</em></h2><p className="approach-copy">We start by listening, work collaboratively, and shape each engagement around the context, people, and outcomes that matter.</p><a className="button button-primary" href="#contact">Work with us <span>↗</span></a></div>
            <div className="process-list"><div className="process-item"><span>01</span><div><h3>Understand</h3><p>Clarify your context, priorities, and desired outcomes.</p></div></div><div className="process-item"><span>02</span><div><h3>Design</h3><p>Build a focused approach grounded in evidence and experience.</p></div></div><div className="process-item"><span>03</span><div><h3>Deliver</h3><p>Translate recommendations into practical next steps.</p></div></div><div className="process-item"><span>04</span><div><h3>Learn & improve</h3><p>Review progress and strengthen results over time.</p></div></div></div>
          </div>
        </div>
      </section>

      <section className="contact-section section-wrap" id="contact">
        <div className="section-kicker"><span>04 / START A CONVERSATION</span><span className="kicker-line"></span></div>
        <div className="contact-grid"><div className="contact-intro"><p className="eyebrow">LET'S BUILD SOMETHING MEANINGFUL</p><h2>Have a challenge<br />in mind? <em>Let's talk.</em></h2><p>Tell us what you are working on, where you want to go, or the problem you are trying to solve. We would welcome the conversation.</p><div className="contact-detail"><span className="detail-icon">↗</span><div><small>OUR PROMISE</small><p>Thoughtful advice. Practical action. Shared progress.</p></div></div><p className="contact-location">Based in Ghana · Open to international collaboration</p></div><ContactForm /></div>
      </section>
    </main>
    <footer className="site-footer"><a className="brand footer-brand" href="#home"><span className="brand-mark">3M<span>.</span></span><span className="brand-name">PARADIGMS<small>CONSULTING GROUP</small></span></a><p>Transforming Knowledge into Impact</p><div className="footer-bottom"><span>© {new Date().getFullYear()} 3M Paradigms Consulting Group</span><a href="#home">Back to top ↑</a></div></footer>
  </div>;
}
