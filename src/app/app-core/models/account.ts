export interface TenantDto {
    userName: string;
    profileUrl: string;
    thumbnailUrl: string;
    deviceAccesses: DeviceAccess[];
    tenantAccesses: TenantAccess[];
}

export interface TenantAccess {
    tenantName: string | null;
    roleList: string[];
}

export interface DeviceAccess {
    deviceId: number;
    deviceName: string;
}

export interface TokenDto {
    userInfo: TenantDto;
    token: string;
    refreshToken: string;
    expiryTime: Date;
}