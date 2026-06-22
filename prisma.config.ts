generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id                    String    @id @default(cuid())
  email                 String    @unique
  password              String
  name                  String
  address               String
  latitude              Float
  longitude             Float
  
  subscriptionTier      String    npm install @prisma/internals --save-dev@default("free")
  subscriptionId        String?   @unique
  subscriptionExpires   DateTime?
  
  balance               Float     @default(50.00)
  lastMoneyUpdate       DateTime?
  
  aiMessagesThisMonth   Int       @default(0)
  aiMessagesReset       DateTime?
  
  adsConsent            Boolean   @default(false)
  analyticsConsent      Boolean   @default(false)
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  orders                Order[]
  aiMessages            AIMessage[]
}

model Order {
  id                    String    @id @default(cuid())
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  items                 OrderItem[]
  total                 Float
  status                String    @default("processing")
  stripePaymentId       String?   @unique
  trackingId            String    @unique
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  tracking              Tracking?
}

model OrderItem {
  id                    String    @id @default(cuid())
  orderId               String
  order                 Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productId             String
  name                  String
  emoji                 String
  price                 Float
  quantity              Int
}

model Tracking {
  id                    String    @id @default(cuid())
  orderId               String    @unique
  order                 Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  trackingId            String    @unique
  routeData             String
  progress              Float     @default(0)
  status                String    @default("processing")
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

model AIMessage {
  id                    String    @id @default(cuid())
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  userMessage           String
  assistantResponse     String
  inputTokens           Int
  outputTokens          Int
  
  createdAt             DateTime  @default(now())
}