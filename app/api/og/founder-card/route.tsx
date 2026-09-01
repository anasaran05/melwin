import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { INITIAL_BMF_MEMBERS, normalizeCategory, slugifyFounderName, BmfMember } from '@/lib/supabase/bmf-members'

export const dynamic = 'force-dynamic'

async function getMemberForOg(idOrSlug: string): Promise<BmfMember> {
  const clean = decodeURIComponent(idOrSlug).trim().toLowerCase()
  
  // 1. Direct Supabase Query using Service Role or Anon Key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      // Query by id, user_id, or email
      const { data: member, error } = await supabase
        .from('bmf_members')
        .select('*')
        .or(`id.eq.${idOrSlug},user_id.eq.${idOrSlug}`)
        .limit(1)
        .maybeSingle()

      if (member && !error) {
        return member as BmfMember
      }

      // If not found directly, query members to match by slug or full_name
      const { data: allMembers } = await supabase
        .from('bmf_members')
        .select('*')
        .limit(100)

      if (allMembers && allMembers.length > 0) {
        const found = allMembers.find(
          (m: BmfMember) =>
            m.id?.toLowerCase() === clean ||
            m.user_id?.toLowerCase() === clean ||
            slugifyFounderName(m.full_name) === clean ||
            m.full_name?.toLowerCase() === clean
        )
        if (found) return found as BmfMember
      }
    } catch (err) {
      console.error('[OG Route Supabase Fetch Error]:', err)
    }
  }

  // 2. Fallback to INITIAL_BMF_MEMBERS
  const fallbackMatch = INITIAL_BMF_MEMBERS.find(
    (m) => m.id.toLowerCase() === clean || slugifyFounderName(m.full_name) === clean
  )
  return fallbackMatch || INITIAL_BMF_MEMBERS[0]
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id') || searchParams.get('founder') || 'bmf-1'
    
    // Fetch member
    const member = await getMemberForOg(id)

    const fullName = member.full_name || 'BMF Founder'
    const role = member.role || 'Founding Member'
    const company = member.company_name || 'Venture Leader'
    const category = normalizeCategory(member.category) || 'AI & SaaS'
    const stage = member.stage || 'Verified Founder'
    const tagline = member.tagline || member.description || 'Verified Member of the BMF Executive Founder Syndicate.'
    const location = member.location || 'Global'
    const isFeatured = Boolean(member.is_featured)

    // Normalize Image URLs
    const normalizeUrl = (url?: string | null) => {
      if (!url || typeof url !== 'string' || url.trim() === '') return ''
      let clean = url.trim()
      if (clean.includes('.r2.dev')) {
        clean = clean.replace(/https?:\/\/[a-zA-Z0-9_-]+\.r2\.dev/, 'https://media.buildwithmelwin.com')
      }
      if (clean.startsWith('/')) {
        clean = `https://buildwithmelwin.com${clean}`
      }
      return clean
    }

    const avatarUrl = normalizeUrl(member.avatar_url) || `https://api.dicebear.com/7.x/personas/png?seed=${encodeURIComponent(fullName)}&backgroundColor=121214`
    const companyLogoUrl = normalizeUrl(member.company_logo)
    const logoMarkUrl = 'https://buildwithmelwin.com/bwm-logo.jpg'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0c0d11',
            backgroundImage: 'radial-gradient(circle at 85% 20%, rgba(16, 185, 129, 0.22), transparent 50%), radial-gradient(circle at 15% 85%, rgba(59, 130, 246, 0.15), transparent 45%)',
            padding: '48px 56px',
            fontFamily: 'sans-serif',
            color: '#ffffff',
            position: 'relative',
          }}
        >
          {/* Subtle Outer Card Border Frame */}
          <div
            style={{
              position: 'absolute',
              inset: '18px',
              border: '2px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '28px',
              pointerEvents: 'none',
            }}
          />

          {/* Top Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {/* BMF Syndicate Badge with /bwm-logo.jpg */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#000000',
                }}
              >
                <img
                  src={logoMarkUrl}
                  alt="BMF Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  BMF CLUB
                </span>
                <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 700, letterSpacing: '0.06em' }}>
                  EXECUTIVE FOUNDER SYNDICATE
                </span>
              </div>
            </div>

            {/* Category & Stage Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(16, 185, 129, 0.18)',
                  border: '1.5px solid rgba(16, 185, 129, 0.45)',
                  padding: '8px 20px',
                  borderRadius: '100px',
                }}
              >
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#34d399' }}>
                  ✦ {category}
                </span>
              </div>

              {stage && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1.5px solid rgba(255, 255, 255, 0.2)',
                    padding: '8px 18px',
                    borderRadius: '100px',
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>
                    {stage}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Middle Body: Avatar (Left) + Identity & Tagline (Right) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
              width: '100%',
              margin: '16px 0',
            }}
          >
            {/* Enlarged Circular Founder Avatar */}
            <div
              style={{
                width: '210px',
                height: '210px',
                borderRadius: '110px',
                border: '5px solid #10b981',
                boxShadow: '0 25px 45px -10px rgba(16, 185, 129, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#18181b',
                flexShrink: 0,
              }}
            >
              <img
                src={avatarUrl}
                alt={fullName}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '110px',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Founder Info & Company Brand */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minWidth: 0,
              }}
            >
              {/* Founder Name & Verification */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span
                  style={{
                    fontSize: '50px',
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    color: '#ffffff',
                    lineHeight: 1.1,
                  }}
                >
                  {fullName}
                </span>
                <span
                  style={{
                    backgroundColor: '#10b981',
                    color: '#000000',
                    fontSize: '15px',
                    fontWeight: 900,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    letterSpacing: '0.05em',
                  }}
                >
                  VERIFIED PASS
                </span>
              </div>

              {/* Role & Company with Logo */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginTop: '10px',
                }}
              >
                {companyLogoUrl && (
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '3px',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={companyLogoUrl}
                      alt={company}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '8px',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                )}
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#34d399' }}>
                  {role} <span style={{ color: '#94a3b8', fontWeight: 500 }}>at</span> <span style={{ color: '#ffffff' }}>{company}</span>
                </span>
              </div>

              {/* Tagline / Bio Quote */}
              <div
                style={{
                  display: 'flex',
                  marginTop: '14px',
                  borderLeft: '4px solid #10b981',
                  paddingLeft: '16px',
                }}
              >
                <span
                  style={{
                    fontSize: '22px',
                    color: '#e2e8f0',
                    fontStyle: 'italic',
                    lineHeight: 1.35,
                    maxHeight: '64px',
                    overflow: 'hidden',
                  }}
                >
                  "{tagline}"
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Info Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: '16px',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '16px' }}>📍 Location:</span>
                <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700 }}>{location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '16px' }}>⚡ Syndicate:</span>
                <span style={{ color: '#34d399', fontSize: '16px', fontWeight: 700 }}>Verified Member</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#60a5fa', fontSize: '17px', fontWeight: 800 }}>
                buildwithmelwin.com/bmf-club
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error: any) {
    console.error('Error generating OpenGraph image:', error)
    return new Response(`Failed to generate card image: ${error.message}`, { status: 500 })
  }
}
