-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('HOME_CLEANING', 'MOVE_OUT_CLEANING', 'OFFICE_CLEANING', 'MOVING', 'DISPOSAL');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('ANFRAGE', 'ANGEBOT', 'BESTAETIGT', 'IN_BEARBEITUNG', 'ABGESCHLOSSEN', 'STORNIERT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE', 'RECHNUNG', 'UEBERWEISUNG', 'BAR', 'PAYPAL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('AUSSTEHEND', 'BEZAHLT', 'UEBERFAELLIG', 'ERSTATTET');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'MODIFIED', 'APPROVED', 'REJECTED', 'EXPIRED', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'PENDING_SIGNATURE', 'SIGNED', 'LOCKED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SignatureMethod" AS ENUM ('DRAWN', 'TYPED');

-- CreateEnum
CREATE TYPE "CommunicationChannel" AS ENUM ('EMAIL', 'INTERNAL_NOTE', 'PHONE');

-- CreateEnum
CREATE TYPE "CommunicationDirection" AS ENUM ('OUTBOUND', 'INBOUND', 'INTERNAL');

-- CreateEnum
CREATE TYPE "PaymentState" AS ENUM ('OPEN', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ManualDocumentType" AS ENUM ('OFFER', 'CONTRACT', 'INVOICE');

-- CreateEnum
CREATE TYPE "ManualDocumentStatus" AS ENUM ('DRAFT', 'SENT', 'APPROVED', 'SIGNED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('hourly', 'km', 'm2', 'm3', 'flat');

-- CreateEnum
CREATE TYPE "ServiceDefinitionType" AS ENUM ('MOVING', 'CLEANING', 'DISPOSAL', 'EXPRESS_MOVING');

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "house_number" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "floor" INTEGER NOT NULL DEFAULT 0,
    "has_elevator" BOOLEAN NOT NULL DEFAULT false,
    "has_parking_zone" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_catalog" (
    "id" TEXT NOT NULL,
    "category" "ServiceCategory" NOT NULL,
    "name_de" TEXT NOT NULL,
    "desc_de" TEXT,
    "icon" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "service_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_pricing" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "zone" TEXT NOT NULL DEFAULT 'DE_DEFAULT',
    "hourly_rate" DOUBLE PRECISION NOT NULL,
    "minimum_hours" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "weekend_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.25,
    "holiday_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.5,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "valid_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_to" TIMESTAMP(3),

    CONSTRAINT "service_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_zones" (
    "id" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "zone" TEXT NOT NULL DEFAULT 'DE_DEFAULT',
    "city" TEXT NOT NULL DEFAULT 'Unbekannt',
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "pricing_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extras" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name_de" TEXT NOT NULL,
    "desc_de" TEXT,
    "time_add_min" INTEGER NOT NULL,
    "extra_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "allow_custom" BOOLEAN NOT NULL DEFAULT false,
    "icon" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "applies_to" TEXT[],
    "service_id" TEXT,
    "pricing_type" "UnitType" NOT NULL DEFAULT 'flat',
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT,

    CONSTRAINT "extras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discounts" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "is_percent" BOOLEAN NOT NULL DEFAULT true,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_to" TIMESTAMP(3) NOT NULL,
    "max_uses" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "code_type" TEXT NOT NULL DEFAULT 'PROMO',
    "stackable" BOOLEAN NOT NULL DEFAULT false,
    "usage_scope" TEXT NOT NULL DEFAULT 'GLOBAL',

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "order_number" TEXT NOT NULL,
    "tracking_number" TEXT,
    "customer_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'ANFRAGE',
    "from_address_id" TEXT,
    "to_address_id" TEXT,
    "scheduled_at" TIMESTAMP(3),
    "time_slot" TEXT,
    "booked_hours" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "extras_time_min" INTEGER NOT NULL DEFAULT 0,
    "total_hours" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "hourly_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "workers" INTEGER NOT NULL DEFAULT 1,
    "volume_m3" DOUBLE PRECISION,
    "distance_km" DOUBLE PRECISION,
    "area_m2" DOUBLE PRECISION,
    "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quote_fingerprint" TEXT,
    "idempotency_key" TEXT,
    "quote_snapshot_json" JSONB,
    "discount_code" TEXT,
    "discount_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mwst" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "payment_method" "PaymentMethod" NOT NULL DEFAULT 'UEBERWEISUNG',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'AUSSTEHEND',
    "stripe_session_id" TEXT,
    "extras_json" JSONB,
    "breakdown_json" JSONB,
    "address_snapshot_json" JSONB,
    "notes" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "contract_id" TEXT,
    "invoice_number" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "pdf_url" TEXT,
    "paid_at" TIMESTAMP(3),
    "due_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL,
    "offer_number" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "title" TEXT,
    "intro_text" TEXT,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "extra_fees" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mwst" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "token" TEXT NOT NULL,
    "latest_version" INTEGER NOT NULL DEFAULT 1,
    "approved_at" TIMESTAMP(3),
    "rejected_at" TIMESTAMP(3),
    "accepted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer_items" (
    "id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SERVICE',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unit_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "meta_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offer_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer_versions" (
    "id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "version_no" INTEGER NOT NULL,
    "snapshot_json" JSONB NOT NULL,
    "address_snapshot_json" JSONB,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offer_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "contract_number" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "token" TEXT NOT NULL,
    "terms_version" TEXT NOT NULL DEFAULT '2026-01',
    "agreed_to_terms_at" TIMESTAMP(3),
    "signed_at" TIMESTAMP(3),
    "signed_by_name" TEXT,
    "signed_by_ip" TEXT,
    "signed_by_user_agent" TEXT,
    "signed_pdf_base64" TEXT,
    "final_netto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "final_mwst" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "final_total_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signatures" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "method" "SignatureMethod" NOT NULL,
    "typed_name" TEXT,
    "image_data_url" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "signature_hash" TEXT,
    "signed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT,
    "offer_id" TEXT,
    "contract_id" TEXT,
    "channel" "CommunicationChannel" NOT NULL,
    "direction" "CommunicationDirection" NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "meta_json" JSONB,
    "sent_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" TEXT,
    "status" "PaymentState" NOT NULL DEFAULT 'OPEN',
    "paid_at" TIMESTAMP(3),
    "reference" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "b2b_contracts" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "category" "ServiceCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price_per_month" DOUBLE PRECISION,
    "price_per_m2" DOUBLE PRECISION,
    "area_m2" DOUBLE PRECISION,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "invoice_schedule" TEXT NOT NULL DEFAULT 'MONTHLY',
    "status" TEXT NOT NULL DEFAULT 'AKTIV',
    "sign_token" TEXT,
    "signed_at" TIMESTAMP(3),
    "signed_by_name" TEXT,
    "contract_pdf_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "b2b_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenders" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ServiceCategory" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "budget" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'OFFEN',
    "attachment_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_cache" (
    "id" TEXT NOT NULL,
    "cache_key" TEXT NOT NULL,
    "from_lat" DOUBLE PRECISION NOT NULL,
    "from_lon" DOUBLE PRECISION NOT NULL,
    "to_lat" DOUBLE PRECISION NOT NULL,
    "to_lon" DOUBLE PRECISION NOT NULL,
    "distance_km" DOUBLE PRECISION NOT NULL,
    "duration_min" INTEGER NOT NULL,
    "geometry_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "route_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manual_expenses" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "document_type" TEXT NOT NULL DEFAULT 'RECHNUNG',
    "description" TEXT NOT NULL,
    "supplier_name" TEXT,
    "document_number" TEXT,
    "account_code" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "net_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax_rate" DOUBLE PRECISION NOT NULL DEFAULT 19,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "date" TIMESTAMP(3) NOT NULL,
    "issue_date" TIMESTAMP(3),
    "service_date" TIMESTAMP(3),
    "payment_method" TEXT,
    "payment_status" TEXT NOT NULL DEFAULT 'PAID',
    "attachment_url" TEXT,
    "attachment_name" TEXT,
    "attachment_mime_type" TEXT,
    "storage_path" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manual_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_areas" (
    "id" TEXT NOT NULL,
    "region_name" TEXT NOT NULL,
    "postal_config_json" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_definitions" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name_de" TEXT NOT NULL,
    "type" "ServiceDefinitionType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "booking_flow_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_rules" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "base_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit_type" "UnitType" NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "min_units" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surcharges" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "name_de" TEXT NOT NULL,
    "trigger_json" JSONB NOT NULL,
    "formula_json" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surcharges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "km_price_eur" DOUBLE PRECISION NOT NULL DEFAULT 0.75,
    "round_trip_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "minimum_fee_eur" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vat_enabled" BOOLEAN NOT NULL DEFAULT true,
    "estimate_label_enabled" BOOLEAN NOT NULL DEFAULT true,
    "base_moving_eur" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "base_disposal_eur" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "base_home_cleaning_eur" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "base_move_out_cleaning_eur" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "base_office_cleaning_eur" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "public_moving_standard_eur" DOUBLE PRECISION NOT NULL DEFAULT 79,
    "public_moving_express_eur" DOUBLE PRECISION NOT NULL DEFAULT 99,
    "public_moving_express_surcharge_pct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "public_home_cleaning_eur" DOUBLE PRECISION NOT NULL DEFAULT 34,
    "public_office_moving_eur" DOUBLE PRECISION NOT NULL DEFAULT 79,
    "public_office_cleaning_eur" DOUBLE PRECISION NOT NULL DEFAULT 34,
    "public_disposal_eur" DOUBLE PRECISION NOT NULL DEFAULT 60,
    "public_move_out_cleaning_eur" DOUBLE PRECISION NOT NULL DEFAULT 34,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer_sequences" (
    "year" INTEGER NOT NULL,
    "current_value" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offer_sequences_pkey" PRIMARY KEY ("year")
);

-- CreateTable
CREATE TABLE "contract_sequences" (
    "year" INTEGER NOT NULL,
    "current_value" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_sequences_pkey" PRIMARY KEY ("year")
);

-- CreateTable
CREATE TABLE "invoice_sequences" (
    "year" INTEGER NOT NULL,
    "current_value" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_sequences_pkey" PRIMARY KEY ("year")
);

-- CreateTable
CREATE TABLE "tracking_sequences" (
    "period" TEXT NOT NULL,
    "current_value" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracking_sequences_pkey" PRIMARY KEY ("period")
);

-- CreateTable
CREATE TABLE "discount_assignments" (
    "id" TEXT NOT NULL,
    "discount_id" TEXT NOT NULL,
    "customer_id" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discount_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manual_documents" (
    "id" TEXT NOT NULL,
    "type" "ManualDocumentType" NOT NULL,
    "status" "ManualDocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "document_number" TEXT NOT NULL,
    "customer_id" TEXT,
    "source_order_id" TEXT,
    "title" TEXT NOT NULL,
    "intro_text" TEXT,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_phone" TEXT,
    "customer_company" TEXT,
    "service_summary" TEXT NOT NULL,
    "service_date" TIMESTAMP(3),
    "time_slot" TEXT,
    "from_address" TEXT,
    "to_address" TEXT,
    "route_distance_km" DOUBLE PRECISION,
    "issue_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMP(3),
    "due_date" TIMESTAMP(3),
    "tax_rate" DOUBLE PRECISION NOT NULL DEFAULT 19,
    "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "items_json" JSONB NOT NULL,
    "notes" TEXT,
    "footer_note" TEXT,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manual_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "service_pricing_service_id_zone_key" ON "service_pricing"("service_id", "zone");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_zones_zip_key" ON "pricing_zones"("zip");

-- CreateIndex
CREATE UNIQUE INDEX "extras_code_key" ON "extras"("code");

-- CreateIndex
CREATE UNIQUE INDEX "discounts_code_key" ON "discounts"("code");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX "orders_tracking_number_key" ON "orders"("tracking_number");

-- CreateIndex
CREATE UNIQUE INDEX "orders_idempotency_key_key" ON "orders"("idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "offers_offer_number_key" ON "offers"("offer_number");

-- CreateIndex
CREATE UNIQUE INDEX "offers_order_id_key" ON "offers"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "offers_token_key" ON "offers"("token");

-- CreateIndex
CREATE INDEX "offer_items_offer_id_idx" ON "offer_items"("offer_id");

-- CreateIndex
CREATE UNIQUE INDEX "offer_versions_offer_id_version_no_key" ON "offer_versions"("offer_id", "version_no");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_contract_number_key" ON "contracts"("contract_number");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_offer_id_key" ON "contracts"("offer_id");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_token_key" ON "contracts"("token");

-- CreateIndex
CREATE INDEX "signatures_contract_id_idx" ON "signatures"("contract_id");

-- CreateIndex
CREATE INDEX "communications_customer_id_idx" ON "communications"("customer_id");

-- CreateIndex
CREATE INDEX "communications_offer_id_idx" ON "communications"("offer_id");

-- CreateIndex
CREATE INDEX "communications_contract_id_idx" ON "communications"("contract_id");

-- CreateIndex
CREATE INDEX "payments_invoice_id_idx" ON "payments"("invoice_id");

-- CreateIndex
CREATE UNIQUE INDEX "b2b_contracts_sign_token_key" ON "b2b_contracts"("sign_token");

-- CreateIndex
CREATE UNIQUE INDEX "route_cache_cache_key_key" ON "route_cache"("cache_key");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "service_definitions_slug_key" ON "service_definitions"("slug");

-- CreateIndex
CREATE INDEX "price_rules_service_id_region_id_enabled_priority_idx" ON "price_rules"("service_id", "region_id", "enabled", "priority");

-- CreateIndex
CREATE INDEX "surcharges_service_id_enabled_priority_idx" ON "surcharges"("service_id", "enabled", "priority");

-- CreateIndex
CREATE INDEX "discount_assignments_discount_id_idx" ON "discount_assignments"("discount_id");

-- CreateIndex
CREATE INDEX "discount_assignments_customer_id_idx" ON "discount_assignments"("customer_id");

-- CreateIndex
CREATE INDEX "discount_assignments_email_idx" ON "discount_assignments"("email");

-- CreateIndex
CREATE INDEX "discount_assignments_phone_idx" ON "discount_assignments"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "manual_documents_document_number_key" ON "manual_documents"("document_number");

-- CreateIndex
CREATE INDEX "manual_documents_customer_id_idx" ON "manual_documents"("customer_id");

-- CreateIndex
CREATE INDEX "manual_documents_type_status_idx" ON "manual_documents"("type", "status");

-- AddForeignKey
ALTER TABLE "service_pricing" ADD CONSTRAINT "service_pricing_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service_catalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extras" ADD CONSTRAINT "extras_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service_catalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service_catalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_from_address_id_fkey" FOREIGN KEY ("from_address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_to_address_id_fkey" FOREIGN KEY ("to_address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_items" ADD CONSTRAINT "offer_items_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_versions" ADD CONSTRAINT "offer_versions_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signatures" ADD CONSTRAINT "signatures_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "b2b_contracts" ADD CONSTRAINT "b2b_contracts_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenders" ADD CONSTRAINT "tenders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_definitions" ADD CONSTRAINT "service_definitions_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_rules" ADD CONSTRAINT "price_rules_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_rules" ADD CONSTRAINT "price_rules_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "service_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surcharges" ADD CONSTRAINT "surcharges_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_assignments" ADD CONSTRAINT "discount_assignments_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_assignments" ADD CONSTRAINT "discount_assignments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_documents" ADD CONSTRAINT "manual_documents_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
