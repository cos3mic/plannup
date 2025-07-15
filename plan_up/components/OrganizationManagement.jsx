import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useOrganizationCustom } from './OrganizationContext';

export default function OrganizationManagement() {
  const {
    organizations,
    myOrgs,
    currentOrg,
    setCurrentOrgId,
    createOrganization,
    joinOrganization,
    leaveOrganization,
  } = useOrganizationCustom();
  const [orgName, setOrgName] = useState('');
  const [joinId, setJoinId] = useState('');

  // Loading state (simulate async if needed)
  if (!organizations) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={{ marginTop: 16, color: '#0a7ea4', fontSize: 16 }}>Loading organizations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Organizations</Text>
      {myOrgs.length === 0 && (
        <Text style={styles.subtitle}>You are not part of any organization yet.</Text>
      )}
      <FlatList
        data={myOrgs}
        keyExtractor={org => org.id}
        renderItem={({ item }) => (
          <View style={styles.orgRow}>
            <Text style={styles.orgName}>{item.name}</Text>
            <TouchableOpacity style={styles.switchBtn} onPress={() => setCurrentOrgId(item.id)}>
              <Text style={styles.switchText}>{currentOrg?.id === item.id ? 'Active' : 'Switch'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.leaveBtn} onPress={() => leaveOrganization(item.id)}>
              <Text style={styles.leaveText}>Leave</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={null}
      />
      <Text style={styles.subtitle}>Create Organization</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Organization name"
          value={orgName}
          onChangeText={setOrgName}
        />
        <TouchableOpacity style={styles.button} onPress={() => { if (orgName) { createOrganization(orgName); setOrgName(''); } }}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Join Organization</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Organization ID"
          value={joinId}
          onChangeText={setJoinId}
        />
        <TouchableOpacity style={styles.button} onPress={() => { if (joinId) { joinOrganization(joinId); setJoinId(''); } }}>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>All Organizations (for demo)</Text>
      <FlatList
        data={organizations}
        keyExtractor={org => org.id}
        renderItem={({ item }) => (
          <View style={styles.orgRow}>
            <Text style={styles.orgName}>{item.name}</Text>
            {!myOrgs.some(o => o.id === item.id) && (
              <TouchableOpacity style={styles.button} onPress={() => joinOrganization(item.id)}>
                <Text style={styles.buttonText}>Join</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      {currentOrg && (
        <>
          <Text style={styles.subtitle}>Members of {currentOrg.name}</Text>
          <FlatList
            data={currentOrg.members}
            keyExtractor={email => email}
            renderItem={({ item }) => (
              <View style={styles.memberRow}>
                <Text style={styles.memberName}>{item}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 8, textAlign: 'center' },
  orgRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'space-between', backgroundColor: '#f7f7f7', padding: 12, borderRadius: 8 },
  orgName: { fontSize: 16, fontWeight: 'bold' },
  switchBtn: { backgroundColor: '#0a7ea4', padding: 8, borderRadius: 8, marginRight: 8 },
  switchText: { color: '#fff', fontWeight: 'bold' },
  leaveBtn: { backgroundColor: '#FF6B6B', padding: 8, borderRadius: 8, marginRight: 8 },
  leaveText: { color: '#fff', fontWeight: 'bold' },
  button: { backgroundColor: '#0a7ea4', padding: 12, borderRadius: 8, marginLeft: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  demoOrgBtn: { backgroundColor: '#eee', padding: 12, borderRadius: 8, marginTop: 8, minWidth: 200, alignItems: 'center' },
  demoOrgText: { color: '#333', fontWeight: 'bold' },
  memberRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  memberName: { flex: 1, fontSize: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8 },
}); 