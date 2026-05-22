import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, assigned_to } = body

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const updateData: any = {}
    if (status) updateData.status = status
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to

    const { data: updatedLead, error: supabaseError } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (supabaseError) {
      console.error('[API] Supabase update error:', supabaseError)
      return NextResponse.json({ error: 'Failed to update lead in database' }, { status: 500 })
    }

    // If status was updated, send Telegram notification
    if (status) {
      const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
      const telegramChatId = process.env.TELEGRAM_CHAT_ID

      if (telegramBotToken && telegramChatId) {
        try {
          const text = `✅ *Lead Updated*\n\n*Name:* ${updatedLead?.name || 'Unknown'}\n*Status:* ${status}\n*Assigned to:* ${updatedLead?.assigned_to || 'Unassigned'}`

          await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: text,
              parse_mode: 'Markdown'
            }),
          })
        } catch (telegramError) {
          console.error('[API] Telegram update notification failed:', telegramError)
        }
      }
    }

    return NextResponse.json({ success: true, lead: updatedLead })
  } catch (error) {
    console.error('[API] Update lead error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
