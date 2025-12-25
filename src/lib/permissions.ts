import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

/**
 * Statement mendefinisikan resource dan actions yang tersedia
 * Format: { resource: ["action1", "action2", ...] }
 */
const statement = {
  ...defaultStatements,
  // Tambahkan custom resources di sini jika diperlukan
  // contoh: kelas: ["create", "read", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

/**
 * Role: admin
 * Akses penuh ke semua fitur
 */
export const admin = ac.newRole({
  ...adminAc.statements,
});

/**
 * Role: guru
 * Akses terbatas - bisa lihat user, tapi tidak bisa ban/delete
 */
export const guru = ac.newRole({
  user: ["list"],
  session: ["list"],
});

/**
 * Role: user
 * Akses minimal
 */
export const user = ac.newRole({
  user: [],
  session: [],
});

export { ac };
