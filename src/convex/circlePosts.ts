import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Check if user is admin of a circle
export const isCircleAdmin = query({
  args: { circleId: v.id("circles") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    const adminRecord = await ctx.db
      .query("circleAdmins")
      .withIndex("by_circle_and_user", (q) =>
        q.eq("circleId", args.circleId).eq("userId", user._id)
      )
      .first();

    return !!adminRecord;
  },
});

// Create a post in a circle
export const createPost = mutation({
  args: {
    circleId: v.id("circles"),
    content: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check if user is a member
    const membership = await ctx.db
      .query("circleMembers")
      .withIndex("by_circle_and_user", (q) =>
        q.eq("circleId", args.circleId).eq("userId", user._id)
      )
      .first();

    if (!membership) {
      throw new Error("You must be a member to post");
    }

    // Check if user is admin (auto-approve) or needs approval
    const isAdmin = await ctx.db
      .query("circleAdmins")
      .withIndex("by_circle_and_user", (q) =>
        q.eq("circleId", args.circleId).eq("userId", user._id)
      )
      .first();

    const circle = await ctx.db.get(args.circleId);
    const requiresApproval = circle?.isPublic === false || !isAdmin;

    const postId = await ctx.db.insert("circlePosts", {
      circleId: args.circleId,
      userId: user._id,
      content: args.content,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
      isApproved: !requiresApproval,
      approvedBy: !requiresApproval ? user._id : undefined,
      approvedAt: !requiresApproval ? Date.now() : undefined,
    });

    return postId;
  },
});

// Get posts for a circle
export const getCirclePosts = query({
  args: { circleId: v.id("circles") },
  handler: async (ctx, args) => {
    // Get posts
    const posts = await ctx.db
      .query("circlePosts")
      .withIndex("by_circle_and_approved", (q) =>
        q.eq("circleId", args.circleId).eq("isApproved", true)
      )
      .order("desc")
      .take(50);

    // Enrich with user data
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.userId);
        const authorAdmin = await ctx.db
          .query("circleAdmins")
          .withIndex("by_circle_and_user", (q) =>
            q.eq("circleId", args.circleId).eq("userId", post.userId)
          )
          .first();

        return {
          ...post,
          author: {
            _id: author?._id,
            name: author?.name || "Unknown User",
            profilePhoto: author?.profilePhoto,
          },
          isAuthorAdmin: !!authorAdmin,
        };
      })
    );

    return enrichedPosts;
  },
});

// Get pending posts (admin only)
export const getPendingPosts = query({
  args: { circleId: v.id("circles") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    // Verify admin status
    const isAdmin = await ctx.db
      .query("circleAdmins")
      .withIndex("by_circle_and_user", (q) =>
        q.eq("circleId", args.circleId).eq("userId", user._id)
      )
      .first();

    if (!isAdmin) return [];

    const posts = await ctx.db
      .query("circlePosts")
      .withIndex("by_circle_and_approved", (q) =>
        q.eq("circleId", args.circleId).eq("isApproved", false)
      )
      .order("desc")
      .collect();

    // Enrich with user data
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.userId);
        return {
          ...post,
          author: {
            _id: author?._id,
            name: author?.name || "Unknown User",
            profilePhoto: author?.profilePhoto,
          },
        };
      })
    );

    return enrichedPosts;
  },
});

// Approve a post (admin only)
export const approvePost = mutation({
  args: { postId: v.id("circlePosts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    // Verify admin status
    const isAdmin = await ctx.db
      .query("circleAdmins")
      .withIndex("by_circle_and_user", (q) =>
        q.eq("circleId", post.circleId).eq("userId", user._id)
      )
      .first();

    if (!isAdmin) throw new Error("Only admins can approve posts");

    await ctx.db.patch(args.postId, {
      isApproved: true,
      approvedBy: user._id,
      approvedAt: Date.now(),
    });
  },
});

// Delete a post
export const deletePost = mutation({
  args: { postId: v.id("circlePosts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    // Check if user is post creator or admin
    const isAdmin = await ctx.db
      .query("circleAdmins")
      .withIndex("by_circle_and_user", (q) =>
        q.eq("circleId", post.circleId).eq("userId", user._id)
      )
      .first();

    if (post.userId !== user._id && !isAdmin) {
      throw new Error("Only post creator or admins can delete posts");
    }

    await ctx.db.delete(args.postId);
  },
});

// Get circle details
export const getCircleDetails = query({
  args: { circleId: v.id("circles") },
  handler: async (ctx, args) => {
    const circle = await ctx.db.get(args.circleId);
    if (!circle) return null;

    const postCount = await ctx.db
      .query("circlePosts")
      .withIndex("by_circle_and_approved", (q) =>
        q.eq("circleId", args.circleId).eq("isApproved", true)
      )
      .collect();

    const admins = await ctx.db
      .query("circleAdmins")
      .withIndex("by_circle", (q) => q.eq("circleId", args.circleId))
      .collect();

    const adminUsers = await Promise.all(
      admins.map(async (admin) => {
        const user = await ctx.db.get(admin.userId);
        return {
          ...admin,
          user: {
            _id: user?._id,
            name: user?.name || "Unknown",
            profilePhoto: user?.profilePhoto,
          },
        };
      })
    );

    return {
      ...circle,
      postCount: postCount.length,
      admins: adminUsers,
    };
  },
});

// Get circle members
export const getCircleMembers = query({
  args: { circleId: v.id("circles") },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("circleMembers")
      .withIndex("by_circle", (q) => q.eq("circleId", args.circleId))
      .collect();

    const enrichedMembers = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        const adminRecord = await ctx.db
          .query("circleAdmins")
          .withIndex("by_circle_and_user", (q) =>
            q.eq("circleId", args.circleId).eq("userId", member.userId)
          )
          .first();

        return {
          ...member,
          user: {
            _id: user?._id,
            name: user?.name || "Unknown User",
            profilePhoto: user?.profilePhoto,
            email: user?.email,
          },
          role: adminRecord?.role || "member",
          isAdmin: !!adminRecord,
        };
      })
    );

    return enrichedMembers;
  },
});

// Assign admin role
export const assignAdmin = mutation({
  args: {
    circleId: v.id("circles"),
    userId: v.id("users"),
    role: v.string(), // "admin" or "moderator"
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const circle = await ctx.db.get(args.circleId);
    if (!circle) throw new Error("Circle not found");

    // Only creator can assign admins
    if (circle.creatorId !== user._id) {
      throw new Error("Only circle creator can assign admins");
    }

    // Check if already admin
    const existing = await ctx.db
      .query("circleAdmins")
      .withIndex("by_circle_and_user", (q) =>
        q.eq("circleId", args.circleId).eq("userId", args.userId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { role: args.role });
    } else {
      await ctx.db.insert("circleAdmins", {
        circleId: args.circleId,
        userId: args.userId,
        role: args.role,
        assignedAt: Date.now(),
        assignedBy: user._id,
      });
    }
  },
});

// Remove admin role
export const removeAdmin = mutation({
  args: {
    circleId: v.id("circles"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const circle = await ctx.db.get(args.circleId);
    if (!circle) throw new Error("Circle not found");

    // Only creator can remove admins
    if (circle.creatorId !== user._id) {
      throw new Error("Only circle creator can remove admins");
    }

    // Cannot remove creator
    if (args.userId === circle.creatorId) {
      throw new Error("Cannot remove circle creator as admin");
    }

    const adminRecord = await ctx.db
      .query("circleAdmins")
      .withIndex("by_circle_and_user", (q) =>
        q.eq("circleId", args.circleId).eq("userId", args.userId)
      )
      .first();

    if (adminRecord) {
      await ctx.db.delete(adminRecord._id);
    }
  },
});
