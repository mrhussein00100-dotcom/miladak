
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/database';
import { dailyEvents as staticEvents, dailyBirthdays as staticBirthdays } from '@/lib/dailyData';
import { CELEBRITIES_BY_DATE } from '@/lib/celebrities';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const day = parseInt(searchParams.get('day') || '');
    const month = parseInt(searchParams.get('month') || '');

    if (isNaN(day) || isNaN(month)) {
      return NextResponse.json(
        { error: 'Day and month are required' },
        { status: 400 }
      );
    }

    // 1. Fetch from Database
    const dbEvents = await query(
      'SELECT * FROM daily_events WHERE day = ? AND month = ? LIMIT 20',
      [day, month]
    );

    const dbBirthdays = await query(
      'SELECT * FROM daily_birthdays WHERE day = ? AND month = ? LIMIT 20',
      [day, month]
    );

    // 2. Fetch from Static Files (dailyData.ts)
    const fileEvents = staticEvents.filter(e => e.day === day && e.month === month);
    const fileBirthdays = staticBirthdays.filter(b => b.day === day && b.month === month);

    // 3. Fetch from Additional Static Files (celebrities.ts)
    const dateKey = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const extraCelebrities = CELEBRITIES_BY_DATE[dateKey] || [];

    // 4. Merge Data (avoid duplicates based on title/name)
    // Events
    const mergedEvents = [...(dbEvents as any[])];
    for (const fe of fileEvents) {
      if (!mergedEvents.some(e => e.title === fe.title)) {
        mergedEvents.push(fe);
      }
    }

    // Birthdays
    const mergedBirthdays = [...(dbBirthdays as any[])];
    
    // Add from dailyData.ts
    for (const fb of fileBirthdays) {
      if (!mergedBirthdays.some(b => b.name === fb.name)) {
        mergedBirthdays.push(fb);
      }
    }
    
    // Add from celebrities.ts
    for (const ec of extraCelebrities) {
      if (!mergedBirthdays.some(b => b.name === ec.name)) {
        mergedBirthdays.push({
          day,
          month,
          birthYear: ec.birthYear,
          name: ec.name,
          profession: ec.profession
        });
      }
    }

    return NextResponse.json({
      events: mergedEvents,
      birthdays: mergedBirthdays
    });
  } catch (error) {
    console.error('Error fetching daily highlights:', error);
    // In case of DB error, fallback to static data only
    try {
        const { searchParams } = new URL(request.url);
        const day = parseInt(searchParams.get('day') || '');
        const month = parseInt(searchParams.get('month') || '');
        
        if (!isNaN(day) && !isNaN(month)) {
            const fileEvents = staticEvents.filter(e => e.day === day && e.month === month);
            const fileBirthdays = staticBirthdays.filter(b => b.day === day && b.month === month);
            
            const dateKey = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const extraCelebrities = CELEBRITIES_BY_DATE[dateKey] || [];
            
            const mergedBirthdays = [...fileBirthdays];
            for (const ec of extraCelebrities) {
                if (!mergedBirthdays.some(b => b.name === ec.name)) {
                    mergedBirthdays.push({
                        day, month, birthYear: ec.birthYear, name: ec.name, profession: ec.profession
                    });
                }
            }
            
            return NextResponse.json({
                events: fileEvents,
                birthdays: mergedBirthdays
            });
        }
    } catch(e) {}

    return NextResponse.json(
      { error: 'Failed to fetch daily highlights' },
      { status: 500 }
    );
  }
}
