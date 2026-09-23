import { CalculateDeliveryCostUseCase } from "@/application/use-cases/calculate-delivery-cost/calculate-delivery-cost.use-case";
import { GeocodeAddressUseCase } from "@/application/use-cases/geocode-address/geocode-address.use-case";
import { GoogleDistanceMatrixService } from "@/infrastructure/geo/google-distance-matrix.service";
import { GoogleGeocodeService } from "@/infrastructure/geo/google-geocode.service";

export function createCheckoutContainer() {
  return {
    geocodeAddress: new GeocodeAddressUseCase(new GoogleGeocodeService()),
    calculateDeliveryCost: new CalculateDeliveryCostUseCase(
      new GoogleDistanceMatrixService(),
    ),
  };
}
