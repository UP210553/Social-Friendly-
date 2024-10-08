interface User {
    user_id?: number,
    interests: Array<number>
}

export class KnnClassifier {
    k: number;
    trainingData: Array<User>;

    constructor(k: number) {
        this.k = k;
        this.trainingData = [];
    }

    train(user: User) {
        this.trainingData.push(user);
    }

    classify(input: User) {
        const distances = this.trainingData.map(user => ({
            distance: this.calculateDistance(input.interests, user.interests),
            user_id: user.user_id
        }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, this.k);

        return distances.map(d => d.user_id);
    }

    calculateDistance(arr1: Array<number>, arr2: Array<number>) {

        const commonInterests = arr1.filter(value => arr2.includes(value));
        return -commonInterests.length;
    }
}

export function TraerUsersCercanos(users: Array<User>, k: number) {
    const classifier = new KnnClassifier(k);
    users.forEach(user => classifier.train(user));

    const newUser: User = { interests: [1, 2, 4] };
    const result = classifier.classify(newUser);
    return result
}