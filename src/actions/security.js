import types from '../types/security';

export const enablePin = () => ({
    type: types.ENABLE_PIN
})

export const enableFingerprint = () => ({
    type: types.ENABLE_FINGERPRINT
})

export const disablePin = () =>({
    type: types.DISABLE_PIN
})

export const disableFingerprint = () => ({
    type: types.DISABLE_FINGERPRINT
})

export const enableTwoFactorAuthAction = () => ({
	type: types.ENABLE_TWO_FACTOR_AUTH
})

export const disableTwoFactorAuthAction = () => ({
	type: types.DISABLE_TWO_FACTOR_AUTH
})
