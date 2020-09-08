export function up(knex) {
  return knex.schema.raw(
    `ALTER TABLE orders
    DROP CONSTRAINT orders_status_check;
    ALTER TABLE orders
    ADD CONSTRAINT orders_status_check
    CHECK ("status" = ANY (ARRAY['pending'::text, 'in_transit'::text, 'delivered'::text, 'cancelled'::text]));
    ALTER TABLE orders ALTER status SET DEFAULT 'pending';`,
  );
}

export function down(knex) {
  return knex.schema.raw(
    `ALTER TABLE orders
    DROP CONSTRAINT orders_status_check;

    ALTER TABLE orders
    ADD CONSTRAINT orders_status_check
    CHECK ("status" = ANY (ARRAY['pending'::text, 'in_transit'::text, 'delivered'::text, 'cancelled'::text]));`,
  );
}
