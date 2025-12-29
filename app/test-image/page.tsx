import Database from 'better-sqlite3';

export default async function TestImagePage() {
  let db: Database.Database | null = null;
  let article: any = null;

  try {
    db = new Database('database.sqlite');
    article = db
      .prepare(
        'SELECT id, title, image, featured_image FROM articles WHERE id = 48'
      )
      .get();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (db) db.close();
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">صفحة اختبار الصورة</h1>

      <div className="bg-blue-100 p-4 rounded-lg mb-8">
        <h2 className="font-bold mb-2">بيانات المقال من قاعدة البيانات:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(article, null, 2)}
        </pre>
      </div>

      {article?.featured_image && (
        <div className="mb-8">
          <h2 className="font-bold mb-2">الصورة البارزة:</h2>
          <p className="text-sm text-gray-600 mb-2">
            المسار: {article.featured_image}
          </p>
          <div className="border-4 border-green-500 rounded-lg overflow-hidden">
            <img
              src={article.featured_image}
              alt="Featured Image"
              className="w-full h-auto"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>
        </div>
      )}

      {article?.image && (
        <div className="mb-8">
          <h2 className="font-bold mb-2">الصورة العادية:</h2>
          <p className="text-sm text-gray-600 mb-2">المسار: {article.image}</p>
          <div className="border-4 border-blue-500 rounded-lg overflow-hidden">
            <img
              src={article.image}
              alt="Image"
              className="w-full h-auto"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>
        </div>
      )}

      <div className="bg-yellow-100 p-4 rounded-lg">
        <h2 className="font-bold mb-2">اختبار مباشر للصورة:</h2>
        <img
          src="/uploads/1765490004617-xnomdz.PNG"
          alt="Direct Test"
          className="w-full h-auto border-4 border-red-500 rounded-lg"
          style={{ maxHeight: '400px', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}
