const Role = require("../models/Role");

async function roleRoutes(fastify, options) {
  // Get all custom roles
  fastify.post("/webservices/roles/get-all-roles", async (req, reply) => {
    try {
      const roles = await Role.findAll();
      const parsedRoles = roles.map((r) => ({
        id: r.id,
        role_name: r.role_name,
        permissions: JSON.parse(r.permissions || "[]"),
      }));
      return reply.send({ status: 1, data: parsedRoles });
    } catch (err) {
      console.error("Error get-all-roles:", err.message);
      return reply.status(500).send({ status: 0, message: err.message });
    }
  });

  // Add a new custom role
  fastify.post("/webservices/roles/add-role", async (req, reply) => {
    try {
      const { role_name, permissions } = req.body;
      if (!role_name) {
        return reply.status(400).send({ status: 0, message: "Role name is required" });
      }

      const existing = await Role.findOne({ where: { role_name } });
      if (existing) {
        return reply.status(400).send({ status: 0, message: "Role already exists" });
      }

      const newRole = await Role.create({
        role_name: role_name.trim(),
        permissions: JSON.stringify(permissions || []),
      });

      return reply.send({
        status: 1,
        message: "Custom role created successfully",
        data: {
          id: newRole.id,
          role_name: newRole.role_name,
          permissions: permissions || [],
        },
      });
    } catch (err) {
      console.error("Error add-role:", err.message);
      return reply.status(500).send({ status: 0, message: err.message });
    }
  });

  // Delete a custom role
  fastify.post("/webservices/roles/delete-role", async (req, reply) => {
    try {
      const { id } = req.body;
      await Role.destroy({ where: { id } });
      return reply.send({ status: 1, message: "Custom role deleted successfully" });
    } catch (err) {
      console.error("Error delete-role:", err.message);
      return reply.status(500).send({ status: 0, message: err.message });
    }
  });
}

module.exports = roleRoutes;