-- CreateTable
CREATE TABLE "incoming_item_table" (
    "incoming_item_id" SERIAL NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "incoming_item_quantity" INTEGER NOT NULL,
    "incoming_item_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incoming_item_table_pkey" PRIMARY KEY ("incoming_item_id")
);

-- CreateTable
CREATE TABLE "item_table" (
    "item_id" SERIAL NOT NULL,
    "item_name" VARCHAR(255) NOT NULL,
    "item_category" VARCHAR(30) NOT NULL,
    "item_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "item_table_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "outgoing_item_table" (
    "outgoing_item_id" SERIAL NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "outgoing_item_quantity" INTEGER NOT NULL,
    "outgoing_item_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outgoing_item_table_pkey" PRIMARY KEY ("outgoing_item_id")
);

-- CreateTable
CREATE TABLE "warehouse_table" (
    "warehouse_id" SERIAL NOT NULL,
    "warehouse_quantity" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "status" VARCHAR(10) DEFAULT 'In-stock',

    CONSTRAINT "warehouse_table_pkey" PRIMARY KEY ("warehouse_id")
);

-- CreateIndex
CREATE INDEX "warehouse_id" ON "incoming_item_table"("warehouse_id");

-- CreateIndex
CREATE INDEX "warehouse_id_fk" ON "outgoing_item_table"("warehouse_id");

-- CreateIndex
CREATE INDEX "item_id" ON "warehouse_table"("item_id");

-- AddForeignKey
ALTER TABLE "incoming_item_table" ADD CONSTRAINT "incoming_item_table_ibfk_1" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse_table"("warehouse_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "outgoing_item_table" ADD CONSTRAINT "outgoing_item_table_ibfk_1" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse_table"("warehouse_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "warehouse_table" ADD CONSTRAINT "warehouse_table_ibfk_1" FOREIGN KEY ("item_id") REFERENCES "item_table"("item_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
