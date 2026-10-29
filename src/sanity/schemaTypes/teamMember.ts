import { defineField, defineType } from "sanity";

/**
 * Team member — one person shown in the "Команда" section on /about.
 * Round photo + name + role. Editors add/remove/reorder people freely.
 */
export const teamMember = defineType({
  name: "teamMember",
  title: "Команда (Про нас)",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Ім'я",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Посада",
      type: "string",
      description: "Напр. «Засновник», «Ростер», «Бариста».",
    }),
    defineField({
      name: "photo",
      title: "Фото",
      type: "image",
      options: { hotspot: true },
      description: "Бажано квадратне — показується у круглій рамці.",
    }),
    defineField({
      name: "order",
      title: "Порядок",
      type: "number",
      initialValue: 10,
      description: "Менше число — раніше у списку. 10, 20, 30…",
    }),
    defineField({
      name: "visible",
      title: "Опублікований",
      type: "boolean",
      initialValue: true,
      description: "Зніми галку щоб тимчасово сховати без видалення.",
    }),
  ],
  orderings: [
    {
      title: "За порядком",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
