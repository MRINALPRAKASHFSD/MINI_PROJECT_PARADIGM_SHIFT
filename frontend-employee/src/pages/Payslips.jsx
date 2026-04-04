import { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import {
  IndianRupee, Download, Calendar, TrendingUp, FileText,
  ChevronDown, ChevronUp, Wallet, PiggyBank, Receipt,
  ArrowDownRight, ArrowUpRight, Eye
} from 'lucide-react';

const Payslips = () => {
  const { payslips } = useDataStore();
  const [expandedSlip, setExpandedSlip] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2026');

  const filteredSlips = payslips.filter(p => p.date.startsWith(selectedYear));

  // YTD calculations
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
    <div style={{ padding: '24px', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Page header — not a card, just text */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 6px' }}>
              Salary & Payslips
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px', maxWidth: '500px', lineHeight: '1.6' }}>
              Your compensation details and monthly payslips. Download any payslip for your records or tax filing.
            </p>
          </div>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '10px', background: 'var(--border-soft)', border: '1px solid var(--btn-ghost-border)', color: 'var(--text-primary)', fontSize: '14px', cursor: 'pointer', outline: 'none' }}
          >
            <option value="2026">FY 2025-26</option>
            <option value="2025">FY 2024-25</option>
          </select>
        </div>
      </div>

      {/* YTD Summary — varied card sizes on purpose */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '14px', marginBottom: '28px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.08) 100%)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(16,185,129,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={22} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>YTD Net Pay</div>
              <div style={{ fontSize: '26px', fontWeight: '700', color: '#10b981' }}>₹{ytdNet.toLocaleString('en-IN')}</div>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Across {filteredSlips.length} month{filteredSlips.length !== 1 ? 's' : ''} in {selectedYear}
          </div>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: '14px', padding: '20px', border: '1px solid var(--btn-ghost-bg)' }}>
          <ArrowUpRight size={18} color="#3b82f6" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Gross Earned</div>
          <div style={{ fontSize: '20px', fontWeight: '700' }}>₹{ytdGross.toLocaleString('en-IN')}</div>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: '14px', padding: '20px', border: '1px solid var(--btn-ghost-bg)' }}>
          <ArrowDownRight size={18} color="#ef4444" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Total Deductions</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#f87171' }}>₹{ytdDeductions.toLocaleString('en-IN')}</div>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: '14px', padding: '20px', border: '1px solid var(--btn-ghost-bg)' }}>
          <TrendingUp size={18} color="#a855f7" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Avg Monthly</div>
          <div style={{ fontSize: '20px', fontWeight: '700' }}>₹{avgMonthly.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Payslip List */}
      <div style={{ background: 'var(--surface-panel)', borderRadius: '18px', border: '1px solid var(--btn-ghost-bg)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--btn-ghost-bg)' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt size={18} color="var(--text-muted)" />
            Monthly Payslips
          </h3>
        </div>

        {filteredSlips.length === 0 && (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No payslips found for {selectedYear}. Check back later!
          </div>
        )}

        {filteredSlips.map((slip, i) => {
          const gross = slip.basic + slip.hra + slip.da + slip.special;
          const deductions = slip.pf + slip.tax + slip.pt + slip.insurance;
          const isExpanded = expandedSlip === slip.id;

          return (
            <div key={slip.id} style={{ borderBottom: i < filteredSlips.length - 1 ? '1px solid var(--surface-inset)' : 'none' }}>
              {/* Summary row */}
              <div
                onClick={() => setExpandedSlip(isExpanded ? null : slip.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={20} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>{slip.month}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Credited on {new Date(slip.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '17px', fontWeight: '700', color: '#10b981' }}>₹{slip.netPay.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Net Pay</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDownload(slip); }}
                    style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                    <Download size={14} /> Download
                  </button>
                  {isExpanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </div>
              </div>

              {/* Expanded breakdown */}
              {isExpanded && (
                <div style={{ padding: '0 24px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* Earnings */}
                  <div style={{ background: 'rgba(16,185,129,0.04)', borderRadius: '12px', padding: '18px', border: '1px solid rgba(16,185,129,0.08)' }}>
                    <h4 style={{ margin: '0 0 14px', fontSize: '13px', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Earnings</h4>
                    {[
                      ['Basic Salary', slip.basic],
                      ['House Rent Allowance', slip.hra],
                      ['Dearness Allowance', slip.da],
                      ['Special Allowance', slip.special],
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '13px', borderBottom: '1px solid var(--surface-inset)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                        <span style={{ fontWeight: '500' }}>₹{val.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: '14px', fontWeight: '700', color: '#10b981' }}>
                      <span>Gross Total</span>
                      <span>₹{gross.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div style={{ background: 'rgba(239,68,68,0.04)', borderRadius: '12px', padding: '18px', border: '1px solid rgba(239,68,68,0.08)' }}>
                    <h4 style={{ margin: '0 0 14px', fontSize: '13px', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Deductions</h4>
                    {[
                      ['Provident Fund', slip.pf],
                      ['Income Tax (TDS)', slip.tax],
                      ['Professional Tax', slip.pt],
                      ['Health Insurance', slip.insurance],
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '13px', borderBottom: '1px solid var(--surface-inset)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                        <span style={{ fontWeight: '500', color: '#fca5a5' }}>- ₹{val.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: '14px', fontWeight: '700', color: '#ef4444' }}>
                      <span>Total Deductions</span>
                      <span>₹{deductions.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom note — casual, human touch */}
      <p style={{ color: 'var(--text-faint)', fontSize: '13px', marginTop: '20px', lineHeight: '1.6', textAlign: 'center' }}>
        Having trouble with your salary? Reach out to HR at <span style={{ color: '#60a5fa' }}>hr@paradigmshift.in</span> or ping Vikram on Slack.
      </p>
    </div>
  );
};

export default Payslips;
