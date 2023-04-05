export default interface IUser {
    id?: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    team?: string | null;
    isAdmin?: boolean;
    isLeader?: boolean;
}
