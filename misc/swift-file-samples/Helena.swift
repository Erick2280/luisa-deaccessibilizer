/*
"Account.swift" file from the Fruta sample project from Apple, modified to be used in the tests.
This code doesn't have any SwiftUI code.
*/

struct Account {
    var orderHistory = [Order]()
    var pointsSpent = 0
    var unstampedPoints = 0
    
    var pointsEarned: Int {
        orderHistory.reduce(0) { $0 + $1.points }
    }
    
    var unspentPoints: Int {
        pointsEarned - pointsSpent
    }
    
    var canRedeemFreeSmoothie: Bool {
        unspentPoints >= 10
    }
    
    mutating func clearUnstampedPoints() {
        unstampedPoints = 0
    }
    
    mutating func appendOrder(_ order: Order) {
        orderHistory.append(order)
        unstampedPoints += order.points
    }
}
