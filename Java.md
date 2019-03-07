# Java

```java
// 使用for each 不加break会报错，如下遍历，map类似
Iterator<SysChargerDO> chargerDOIterator = chargerDOList.iterator();
while (chargerDOIterator.hasNext()) {
    if (mapIdList.contains(chargerDOIterator.next().getSysMapId())) {
        chargerDOIterator.remove();
        break;
    }
}

// Double转BigDecimal
Double a = 0.01;
BigDecimal b = new BigDecimal(a); // 丢失精度
BigDecimal b = new BigDecimal(a.toString()); // 正确
// 按权重抽奖
public static final int[] LUCKY_DRAW_WEIGHT_ARRAY = new int[]{1, 2, 3, 4, 5, 6};
int[] weightArray = Constants.LUCKY_DRAW_WEIGHT_ARRAY;
List<Integer> weightList = new ArrayList<>(Arrays.asList(ArrayUtils.toObject(weightArray)));
List<Integer> weightSumList = new ArrayList<>();
int sum = 0;
for (int weight : weightList) {
    weightSumList.add(sum);
    sum += weight;
}
Random random = new Random();
int rand = random.nextInt(sum);
int result = Constants.LUCKY_DRAW_NOT_WIN;
for (int i = weightSumList.size() - 1; i >= 0; i--) {
    if (rand >= weightSumList.get(i)) {
        result = i;
        break;
    }
}
return result;

CrossOrigin 不同机子跨域，同一机子配置nginx
```