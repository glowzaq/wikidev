import { Dev } from "@/models/dev.model";
import { devType } from "@/app/shared/type";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { google } from "googleapis"


const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export const devResolver = {
    Query: {
        devs: async () => await Dev.find({}).populate("bookmarks"),
        dev: async (_: any, { id }: { id: string }) => await Dev.findById(id).populate("bookmarks"),
        devsCount: async () => await Dev.countDocuments(),
        googleAuthUrl: () => {
            return oauth2Client.generateAuthUrl({
                access_type: "offline",
                scope: ["email", "profile"],
            });
        },
    },
    Mutation: {
        createDev: async (_: any, { firstName, lastName, email, password }: devType) => {
            const existingDev = await Dev.findOne({ email })
            if (existingDev) {
                throw new Error("Dev with this email already exists")
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            const newDev = await Dev.create({
                firstName,
                lastName,
                email,
                password: hashedPassword
            })
            return newDev
        },

        loginDev: async (_: any, { email, password }: { email: string, password: string }) => {
            const dev = await Dev.findOne({ email })
            if (!dev) {
                throw new Error('Invalid email or password')
            }
            // Google OAuth users have no password
            if (!dev.password) {
                throw new Error('This account uses Google sign-in. Please continue with Google.')
            }
            const isMatch = await bcrypt.compare(password, dev.password)
            if (!isMatch) {
                throw new Error('Invalid email or password')
            }
            const token = jwt.sign(
                { id: dev._id, email: dev.email, firstName: dev.firstName, lastName: dev.lastName, role: dev.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '1d' }
            );
            return { token, dev }
        },

        googleCallback: async (_: any, { code }: { code: string }) => {
            // 1. Exchange the code Google sent for access tokens
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);

            // 2. Use the tokens to get the user's Google profile
            const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
            const { data } = await oauth2.userinfo.get();

            if (!data.email) throw new Error("Could not retrieve email from Google.");

            // 3. Find existing dev or create a new one
            let dev = await Dev.findOne({ email: data.email });
            if (!dev) {
                dev = await Dev.create({
                    firstName: data.given_name ?? "",
                    lastName: data.family_name ?? "",
                    email: data.email,
                    password: "",
                });
            }

            // 4. Sign JWT the same way loginDev does
            const token = jwt.sign(
                { id: dev._id, email: dev.email, firstName: dev.firstName, lastName: dev.lastName, role: dev.role },
                process.env.JWT_SECRET as string,
                { expiresIn: "1d" }
            );

            return { token, dev };
        },

        bookmarkArticle: async (_: any, { devId, articleId }: { devId: string, articleId: string }) => {
            const dev = await Dev.findByIdAndUpdate(
                devId,
                { $addToSet: { bookmarks: articleId } },
                { returnDocument: 'after' }
            ).populate("bookmarks");
            if (!dev) throw new Error("Dev not found");
            return dev;
        },

        unbookmarkArticle: async (_: any, { devId, articleId }: { devId: string, articleId: string }) => {
            const dev = await Dev.findByIdAndUpdate(
                devId,
                { $pull: { bookmarks: articleId } },
                { returnDocument: 'after' }
            ).populate("bookmarks");
            if (!dev) throw new Error("Dev not found");
            return dev;
        },

        updateDev: async (_: any, { id, firstName, lastName, email, bio }: { id: string, firstName?: string, lastName?: string, email?: string, bio?: string }) => {
            if (email) {
                const existing = await Dev.findOne({ email, _id: { $ne: id } });
                if (existing) throw new Error("Email already in use");
            }
            const dev = await Dev.findByIdAndUpdate(
                id,
                { firstName, lastName, email, bio },
                { new: true }
            );
            if (!dev) throw new Error("Dev not found");
            return dev;
        },

        updatePassword: async (_: any, { id, currentPassword, newPassword }: { id: string, currentPassword: string, newPassword: string }) => {
            const dev = await Dev.findById(id);
            if (!dev) throw new Error("Dev not found");

            const isMatch = await bcrypt.compare(currentPassword, dev.password);
            if (!isMatch) throw new Error("Current password incorrect");

            const hashed = await bcrypt.hash(newPassword, 12);
            dev.password = hashed;
            await dev.save();
            return true;
        },

        deleteDev: async (_: any, { id }: { id: string }) => {
            const dev = await Dev.findByIdAndDelete(id);
            if (!dev) throw new Error("Dev not found");
            return true;
        }
    }
}