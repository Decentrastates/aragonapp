export interface IDrawSetupMembershipMember {
    address: string;
    tokenAmount?: string;
}

export interface IDrawSetupMembershipForm {
    members: IDrawSetupMembershipMember[];
}