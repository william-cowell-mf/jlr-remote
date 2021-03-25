import { createMock } from 'ts-auto-mock'
import { QueryVehicleInformationService } from '../src/Services/QueryVehicleInformationService'
import { VehicleAttributes } from '../src/JaguarLandRover/ServiceTypes'
import { VehicleRemote } from '../src/Remotes/VehicleRemote'
import { VehicleRemoteAuthenticator } from '../src/Remotes/VehicleRemoteAuthenticator'

describe('Vehicle Remote', () => {
    describe('Get vehicle attributes', () => {
        test('returns vehicle attributes', async () => {
            // Arrange
            const attributes = createMock<VehicleAttributes>()
            const mockGetVehicleAttributes = jest.fn()
            mockGetVehicleAttributes.mockImplementation(() => Promise.resolve(attributes))
            
            const mockService = createMock<QueryVehicleInformationService>()
            mockService.getVehicleAttributes = mockGetVehicleAttributes
            
            const remote = new VehicleRemote('', '', createMock<VehicleRemoteAuthenticator>(), mockService)

            // Act
            const response = await remote.getVehicleAttributes()
    
            // Assert
            expect(response).toBe(attributes)
        })

        test.each(['hello world', 'example token', 'this token is not even real'])
            ('uses the access token', async (expectedAccessToken: string) => {
            // Arrange
            const mockVehicleRemoteAuthentication = createMock<VehicleRemoteAuthenticator>()
            const mockGetAccessToken = jest.fn()
            mockGetAccessToken.mockImplementation(() => Promise.resolve(expectedAccessToken))

            mockVehicleRemoteAuthentication.getAccessToken = mockGetAccessToken

            const mockService = createMock<QueryVehicleInformationService>()
            const remote = new VehicleRemote('', '', mockVehicleRemoteAuthentication, mockService)

            // Act
            await remote.getVehicleAttributes()

            // Assert
            expect(mockService.getVehicleAttributes).toHaveBeenCalledWith(
                expectedAccessToken,
                expect.any(String),
                expect.any(String))
        })

        test.each(['hello world', 'cat', 'dog'])
            ('uses the device ID `%s`', async (expectedDeviceId) => {
            // Arrange
            const mockService = createMock<QueryVehicleInformationService>()
            const remote = new VehicleRemote(expectedDeviceId, '', createMock<VehicleRemoteAuthenticator>(), mockService)

            // Act
            await remote.getVehicleAttributes()

            // Assert
            expect(mockService.getVehicleAttributes).toHaveBeenCalledWith(
                expect.any(String),
                expectedDeviceId,
                expect.any(String))
        })

        test.each(['hello world', 'dog', 'cat'])
            ('uses the VIN `%s`', async (expectedVIN) => {
            // Arrange
            const mockService = createMock<QueryVehicleInformationService>()
            const remote = new VehicleRemote('', expectedVIN, createMock<VehicleRemoteAuthenticator>(), mockService)

            // Act
            await remote.getVehicleAttributes()

            // Assert
            expect(mockService.getVehicleAttributes).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(String),
                expectedVIN)
        })
    }) 
})
