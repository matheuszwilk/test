-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleProduct" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "andon" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "no" INTEGER,
    "chk" TEXT,
    "status" TEXT,
    "equipment_line" TEXT,
    "andon_process" TEXT,
    "andon_no" INTEGER,
    "main_sub" TEXT,
    "start" TIMESTAMP(6),
    "end" TIMESTAMP(6),
    "run_time_hms" TEXT,
    "run_time_sec" INTEGER,
    "warning_stop" TEXT,
    "andon_type" TEXT,
    "cause_department" TEXT,
    "cause_department_1" TEXT,
    "reason" TEXT,
    "andon_time" INTEGER,

    CONSTRAINT "andon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "andon_monthly_top_defects" (
    "id" UUID NOT NULL,
    "year_month" VARCHAR(7),
    "andon_process" VARCHAR(50),
    "equipment_line" VARCHAR(50),
    "reason" VARCHAR(200),
    "end_date" TIMESTAMP(6),
    "cause_department" VARCHAR(50),
    "andon_time" INTEGER,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(2) DEFAULT 'NG',
    "action_plan_file_url" TEXT,

    CONSTRAINT "andon_monthly_top_defects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manhour" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization" TEXT,
    "line" TEXT,
    "shift" TEXT,
    "work_part" TEXT,
    "work_date" DATE,
    "model_or_model_suffix" TEXT,
    "total_working_time" DOUBLE PRECISION,
    "net_working_time" DOUBLE PRECISION,
    "production_quantity" INTEGER,
    "uph" DOUBLE PRECISION,
    "yield_man_hour" DOUBLE PRECISION,
    "total_attendance_man_hour" DOUBLE PRECISION,
    "direct_man_hour" DOUBLE PRECISION,
    "indirect_man_hour" DOUBLE PRECISION,
    "idle_man_hour" DOUBLE PRECISION,
    "controllable_idle_man_hour" DOUBLE PRECISION,
    "uncontrollable_idle_man_hour" DOUBLE PRECISION,
    "rework_man_hour" DOUBLE PRECISION,
    "net_working_man_hour" DOUBLE PRECISION,
    "direct_on_operation" INTEGER,
    "indirect_on_operation" INTEGER,
    "total_on_operation" INTEGER,

    CONSTRAINT "manhour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SaleProduct_productId_idx" ON "SaleProduct"("productId");

-- CreateIndex
CREATE INDEX "SaleProduct_saleId_idx" ON "SaleProduct"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "andon_monthly_top_defects_id_key" ON "andon_monthly_top_defects"("id");

-- AddForeignKey
ALTER TABLE "SaleProduct" ADD CONSTRAINT "SaleProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleProduct" ADD CONSTRAINT "SaleProduct_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
