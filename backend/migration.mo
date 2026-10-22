import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Float "mo:core/Float";
import List "mo:core/List";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";

module {
  type OldVesselData = {
    id : Text;
    name : Text;
    coordinates : {
      lat : Float;
      lng : Float;
    };
    speed : Float;
    riskScore : Float;
    lastUpdated : Time.Time;
    motionDirection : Float;
  };

  type NewVesselData = {
    id : Text;
    name : Text;
    type_ : Text;
    mmsi : Text;
    coordinates : { lat : Float; lng : Float };
    speed : Float;
    riskScore : Float;
    riskLevel : Text;
    lastUpdated : Time.Time;
    motionDirection : Float;
    heading : Float;
  };

  type OldActor = {
    vessels : Map.Map<Text, OldVesselData>;
    // ... (other fields omitted for brevity)
  };

  type NewActor = {
    vessels : Map.Map<Text, NewVesselData>;
    // ... (other fields omitted for brevity)
  };

  public func run(old : OldActor) : NewActor {
    let newVessels = old.vessels.map<Text, OldVesselData, NewVesselData>(
      func(_id, oldVessel) {
        {
          id = oldVessel.id;
          name = oldVessel.name;
          type_ = "Unknown"; // Default value for new field
          mmsi = ""; // Default value for new field
          coordinates = oldVessel.coordinates;
          speed = oldVessel.speed;
          riskScore = oldVessel.riskScore;
          riskLevel = "Low"; // Default value for new field
          lastUpdated = oldVessel.lastUpdated;
          motionDirection = oldVessel.motionDirection;
          heading = 0.0; // Default value for new field
        };
      }
    );
    { old with vessels = newVessels };
  };
};
