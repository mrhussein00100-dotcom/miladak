import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db/database';

interface Birthstone {
  id?: number;
  month: number;
  primary_stone: string;
  secondary_stone?: string;
  color?: string;
  meaning?: string;
  properties?: string;
}

interface BirthFlower {
  id?: number;
  month: number;
  primary_flower: string;
  secondary_flower?: string;
  color?: string;
  meaning?: string;
  symbolism?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const type = searchParams.get('type'); // 'birthstone' or 'birth_flower'

    let birthstones: Birthstone[] = [];
    let birthFlowers: BirthFlower[] = [];

    if (!type || type === 'birthstone') {
      let stoneQuery = 'SELECT * FROM birthstones';
      const stoneParams: any[] = [];

      if (month) {
        stoneQuery += ' WHERE month = ?';
        stoneParams.push(parseInt(month));
      }

      stoneQuery += ' ORDER BY month';
      birthstones = await query<Birthstone>(stoneQuery, stoneParams);
    }

    if (!type || type === 'birth_flower') {
      let flowerQuery = 'SELECT * FROM birth_flowers';
      const flowerParams: any[] = [];

      if (month) {
        flowerQuery += ' WHERE month = ?';
        flowerParams.push(parseInt(month));
      }

      flowerQuery += ' ORDER BY month';
      birthFlowers = await query<BirthFlower>(flowerQuery, flowerParams);
    }

    return NextResponse.json({
      success: true,
      data: {
        birthstones,
        birth_flowers: birthFlowers,
      },
    });
  } catch (error) {
    console.error('Error fetching birthstones and flowers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في جلب أحجار وزهور الميلاد',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { type, ...itemData } = data;

    if (type === 'birthstone') {
      const birthstone: Birthstone = itemData;

      // التحقق من صحة البيانات
      if (!birthstone.month || !birthstone.primary_stone) {
        return NextResponse.json(
          {
            success: false,
            error: 'البيانات المطلوبة مفقودة',
          },
          { status: 400 }
        );
      }

      // حذف الحجر الموجود للشهر نفسه لتجنب الازدواجية
      await await execute('DELETE FROM birthstones WHERE month = ?', [
        birthstone.month,
      ]);

      const result = await await execute(
        'INSERT INTO birthstones (month, primary_stone, secondary_stone, color, meaning, properties) VALUES (?, ?, ?, ?, ?, ?)',
        [
          birthstone.month,
          birthstone.primary_stone,
          birthstone.secondary_stone || '',
          birthstone.color || '',
          birthstone.meaning || '',
          birthstone.properties || '',
        ]
      );

      return NextResponse.json({
        success: true,
        data: { id: result.lastInsertRowid, ...birthstone },
      });
    } else if (type === 'birth_flower') {
      const birthFlower: BirthFlower = itemData;

      // التحقق من صحة البيانات
      if (!birthFlower.month || !birthFlower.primary_flower) {
        return NextResponse.json(
          {
            success: false,
            error: 'البيانات المطلوبة مفقودة',
          },
          { status: 400 }
        );
      }

      // حذف الزهرة الموجودة للشهر نفسه لتجنب الازدواجية
      await await execute('DELETE FROM birth_flowers WHERE month = ?', [
        birthFlower.month,
      ]);

      const result = await await execute(
        'INSERT INTO birth_flowers (month, primary_flower, secondary_flower, color, meaning, symbolism) VALUES (?, ?, ?, ?, ?, ?)',
        [
          birthFlower.month,
          birthFlower.primary_flower,
          birthFlower.secondary_flower || '',
          birthFlower.color || '',
          birthFlower.meaning || '',
          birthFlower.symbolism || '',
        ]
      );

      return NextResponse.json({
        success: true,
        data: { id: result.lastInsertRowid, ...birthFlower },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'نوع البيانات غير صحيح',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating birthstone/flower:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في إضافة البيانات',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { type, id, ...itemData } = data;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'معرف العنصر مطلوب للتحديث',
        },
        { status: 400 }
      );
    }

    if (type === 'birthstone') {
      const birthstone: Birthstone = itemData;

      await await execute(
        'UPDATE birthstones SET month = ?, primary_stone = ?, secondary_stone = ?, color = ?, meaning = ?, properties = ? WHERE id = ?',
        [
          birthstone.month,
          birthstone.primary_stone,
          birthstone.secondary_stone || '',
          birthstone.color || '',
          birthstone.meaning || '',
          birthstone.properties || '',
          id,
        ]
      );

      return NextResponse.json({
        success: true,
        data: { id, ...birthstone },
      });
    } else if (type === 'birth_flower') {
      const birthFlower: BirthFlower = itemData;

      await await execute(
        'UPDATE birth_flowers SET month = ?, primary_flower = ?, secondary_flower = ?, color = ?, meaning = ?, symbolism = ? WHERE id = ?',
        [
          birthFlower.month,
          birthFlower.primary_flower,
          birthFlower.secondary_flower || '',
          birthFlower.color || '',
          birthFlower.meaning || '',
          birthFlower.symbolism || '',
          id,
        ]
      );

      return NextResponse.json({
        success: true,
        data: { id, ...birthFlower },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'نوع البيانات غير صحيح',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating birthstone/flower:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في تحديث البيانات',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      return NextResponse.json(
        {
          success: false,
          error: 'معرف العنصر ونوعه مطلوبان للحذف',
        },
        { status: 400 }
      );
    }

    if (type === 'birthstone') {
      await await execute('DELETE FROM birthstones WHERE id = ?', [parseInt(id)]);
    } else if (type === 'birth_flower') {
      await await execute('DELETE FROM birth_flowers WHERE id = ?', [parseInt(id)]);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'نوع البيانات غير صحيح',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف العنصر بنجاح',
    });
  } catch (error) {
    console.error('Error deleting birthstone/flower:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في حذف العنصر',
      },
      { status: 500 }
    );
  }
}
