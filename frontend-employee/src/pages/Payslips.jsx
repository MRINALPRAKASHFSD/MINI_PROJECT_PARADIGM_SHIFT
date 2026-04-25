import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import {
  IndianRupee, Download, Calendar, TrendingUp, FileText,
  ChevronDown, ChevronUp, Wallet, PiggyBank, Receipt,
  ArrowDownRight, ArrowUpRight, Eye, Mail, Info, ArrowRight
} from 'lucide-react';

const Payslips = () => {
  const { payslips } = useDataStore();
  const [expandedSlip, setExpandedSlip] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2026');

  const filteredSlips = payslips.filter(p => p.date.startsWith(selectedYear));

  const ytdGross = filteredSlips.reduce((s, p) => s + p.basic + p.hra + p.da + p.special, 0);
  const ytdDeductions = filteredSlips.reduce((s, p) => s + p.pf + p.tax + p.pt + p.insurance, 0);
  const ytdNet = filteredSlips.reduce((s, p) => s + p.netPay, 0);
  const avgMonthly = filteredSlips.length > 0 ? Math.round(ytdNet / filteredSlips.length) : 0;

  const handleDownload = (slip) => {
    const text = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        PARADIGM SHIFT TECHNOLOGIES
            SALARY SLIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Employee: Rajesh Kumar
Employee ID: PS-EMP-1047
Department: Engineering
Designation: Senior Developer
Pay Period: ${slip.month}

──────────────── EARNINGS ────────────────
Basic Salary        ₹${slip.basic.toLocaleString('en-IN')}
HRA                 ₹${slip.hra.toLocaleString('en-IN')}
Dearness Allowance  ₹${slip.da.toLocaleString('en-IN')}
Special Allowance   ₹${slip.special.toLocaleString('en-IN')}
                    ─────────────
Gross Salary        ₹${(slip.basic + slip.hra + slip.da + slip.special).toLocaleString('en-IN')}

──────────────── DEDUCTIONS ──────────────
PF (Employee)       ₹${slip.pf.toLocaleString('en-IN')}
Income Tax (TDS)    ₹${slip.tax.toLocaleString('en-IN')}
Professional Tax    ₹${slip.pt.toLocaleString('en-IN')}
Health Insurance    ₹${slip.insurance.toLocaleString('en-IN')}
                    ─────────────
Total Deductions    ₹${(slip.pf + slip.tax + slip.pt + slip.insurance).toLocaleString('en-IN')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NET PAY:            ₹${slip.netPay.toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is a system-generated payslip.
Generated on ${new Date().toLocaleDateString('en-IN')}
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip_${slip.month.replace(' ', '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh', position: 'relative' }}>
      {/* Background Ambient Glows */}
      <div className="ambient-glow" style={{ top: '5%', left: '10%', background: 'var(--primary-glow)', width: '350px', height: '350px' }} />
      <div className="ambient-glow" style={{ bottom: '10%', right: '5%', background: 'var(--secondary-glow)', width: '400px', height: '400px' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 25px var(--primary-glow)' }}>
            <Wallet size={32} color="#fff" />
          </motion.div>
          <div>
            <h1 style={{ margin: 0, fontSize: '34px', fontWeight: '800', letterSpacing: '-1px' }}>Payroll & Compensation</h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '15px', fontWeight: '500' }}>Review your earnings, taxes, and net compensation</p>
          </div>
        </div>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          className="glass-panel"
          style={{ padding: '14px 24px', borderRadius: '16px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)', fontSize: '15px', fontWeight: '700', cursor: 'pointer', outline: 'none' }}
        >
          <option value="2026">Financial Year 2026</option>
          <option value="2025">Financial Year 2025</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '28px', padding: '32px', color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px var(--primary-glow)' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.15, transform: 'rotate(15deg)' }}><IndianRupee size={160} /></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9, marginBottom: '10px' }}>YTD Net Compensation</div>
            <div style={{ fontSize: '42px', fontWeight: '900', marginBottom: '10px', letterSpacing: '-1px' }}>₹{ytdNet.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '14px', fontWeight: '600', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> Fiscal Cycle {selectedYear}</div>
          </div>
        </motion.div>

        {[
          { label: 'Gross Earnings', value: ytdGross, icon: ArrowUpRight, color: 'var(--primary)' },
          { label: 'Total Deductions', value: ytdDeductions, icon: ArrowDownRight, color: '#f43f5e' },
          { label: 'Avg Monthly Takeaway', value: avgMonthly, icon: TrendingUp, color: 'var(--secondary)' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
            className="glass-panel" style={{ borderRadius: '28px', padding: '28px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${item.color}30` }}><item.icon size={24} color={item.color} /></div>
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.8px', marginBottom: '8px' }}>{item.label}</div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>₹{item.value.toLocaleString('en-IN')}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel" style={{ borderRadius: '32px', border: '1px solid var(--border-glass)', overflow: 'hidden', backdropFilter: 'blur(30px)' }}>
        <div style={{ padding: '28px 36px', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}><Receipt size={24} color="var(--primary)" /></div>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Payment Ledger</h3>
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '6px 16px', borderRadius: '20px' }}>Showing {filteredSlips.length} Cycles</span>
        </div>

        {filteredSlips.length === 0 ? (
          <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={56} style={{ opacity: 0.1, marginBottom: '20px' }} />
            <p style={{ fontWeight: '700', fontSize: '18px' }}>No payroll history found for {selectedYear}</p>
          </div>
        ) : (
          <div className="ledger-container">
            {filteredSlips.map((slip, i) => {
              const isExpanded = expandedSlip === slip.id;
              const gross = slip.basic + slip.hra + slip.da + slip.special;
              const deductions = slip.pf + slip.tax + slip.pt + slip.insurance;

              return (
                <div key={slip.id} style={{ borderBottom: i < filteredSlips.length - 1 ? '1px solid var(--border-glass)' : 'none' }}>
                  <motion.div 
                    onClick={() => setExpandedSlip(isExpanded ? null : slip.id)}
                    style={{ padding: '28px 36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s' }}
                    whileHover={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-glass)' }}><Calendar size={24} color="var(--primary)" /></div>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '800' }}>{slip.month}</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>Transferred on {new Date(slip.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#10b981' }}>₹{slip.netPay.toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>In Hand</div>
                      </div>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <motion.button 
                          onClick={(e) => { e.stopPropagation(); handleDownload(slip); }}
                          whileHover={{ scale: 1.1, background: 'var(--primary)', color: '#fff' }}
                          style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        >
                          <Download size={20} />
                        </motion.button>
                        <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                          {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '0 36px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                          <div className="glass-panel" style={{ borderRadius: '24px', padding: '28px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.01)' }}>
                            <h4 style={{ margin: '0 0 24px', fontSize: '14px', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '10px' }}><ArrowUpRight size={18} /> Earnings Component</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {[
                                { label: 'Basic Retainer', val: slip.basic },
                                { label: 'HRA Assistance', val: slip.hra },
                                { label: 'DA Allowance', val: slip.da },
                                { label: 'Special Performance', val: slip.special },
                              ].map((row, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                  <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{row.label}</span>
                                  <span style={{ fontWeight: '700' }}>₹{row.val.toLocaleString('en-IN')}</span>
                                </div>
                              ))}
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '900', marginTop: '12px', color: 'var(--primary)' }}>
                                <span>Total Gross</span>
                                <span>₹{gross.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>

                          <div className="glass-panel" style={{ borderRadius: '24px', padding: '28px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.01)' }}>
                            <h4 style={{ margin: '0 0 24px', fontSize: '14px', fontWeight: '900', color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '10px' }}><ArrowDownRight size={18} /> Deductions Breakdown</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {[
                                { label: 'Statutory PF', val: slip.pf },
                                { label: 'Income Tax (TDS)', val: slip.tax },
                                { label: 'Professional Tax', val: slip.pt },
                                { label: 'Healthcare Premium', val: slip.insurance },
                              ].map((row, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                  <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{row.label}</span>
                                  <span style={{ fontWeight: '700', color: '#f43f5e' }}>- ₹{row.val.toLocaleString('en-IN')}</span>
                                </div>
                              ))}
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '900', marginTop: '12px', color: '#f43f5e' }}>
                                <span>Total Deducted</span>
                                <span>₹{deductions.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ marginTop: '48px', padding: '32px', borderRadius: '24px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '24px', background: 'linear-gradient(90deg, rgba(79,70,229,0.05), transparent)' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(79,70,229,0.2)' }}><Info size={28} color="var(--primary)" /></div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7', fontWeight: '600' }}>
            Looking for tax projections or investment declarations? Head over to the <span style={{ color: 'var(--primary)', fontWeight: '800', cursor: 'pointer' }}>Tax Planning Portal</span> for advanced tools and calculators. 
            For payroll queries, contact <span style={{ color: 'var(--primary)', fontWeight: '800' }}>payroll@paradigmshift.io</span>.
          </p>
        </div>
        <motion.button whileHover={{ x: 5 }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
          Open Help Desk <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
};

export default Payslips;
