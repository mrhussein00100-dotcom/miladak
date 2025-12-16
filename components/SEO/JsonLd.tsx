/**
 * JSON-LD Component
 * مكون لإضافة البيانات المنظمة للصفحات
 */

import React from 'react';

interface JsonLdProps {
  data: object | object[];
}

/**
 * مكون JSON-LD لإضافة البيانات المنظمة
 * يدعم schema واحد أو مصفوفة من schemas
 */
export function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}

/**
 * مكون JSON-LD للمؤسسة
 */
export function OrganizationJsonLd({ data }: { data: object }) {
  return <JsonLd data={data} />;
}

/**
 * مكون JSON-LD للمقال
 */
export function ArticleJsonLd({ data }: { data: object }) {
  return <JsonLd data={data} />;
}

/**
 * مكون JSON-LD لتطبيق الويب
 */
export function WebApplicationJsonLd({ data }: { data: object }) {
  return <JsonLd data={data} />;
}

/**
 * مكون JSON-LD للتنقل
 */
export function BreadcrumbJsonLd({ data }: { data: object }) {
  return <JsonLd data={data} />;
}

/**
 * مكون JSON-LD للأسئلة الشائعة
 */
export function FAQJsonLd({ data }: { data: object }) {
  return <JsonLd data={data} />;
}

export default JsonLd;
